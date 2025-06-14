import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BubbleSelect from './BubbleSelect';
import ProductCard from './ProductCard';
import { Product, GiftFinderSelections, ageRanges, genders, occasions, interestsList } from '@/types';
import { Loader2, Search, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiftFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock LLM call / Product fetching logic (remains the same)
const fetchGiftSuggestions = async (selections: GiftFinderSelections): Promise<Product[]> => {
  console.log("Fetching gifts with selections:", selections);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  try {
    const response = await fetch('/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allProducts: Product[] = await response.json();
    console.log("All products fetched:", allProducts.length);
    const filteredProducts = allProducts.filter(product => {
      const ageMatch = selections.ageRange ? product.ageRange.includes(selections.ageRange) : true;
      const genderMatch = selections.gender ? product.gender.includes(selections.gender) : true;
      const occasionMatch = selections.occasion ? product.occasion.includes(selections.occasion) : true;
      const interestMatch = selections.interests.length > 0 ? selections.interests.some(interest => product.interests.includes(interest)) : true;
      return ageMatch && genderMatch && occasionMatch && interestMatch;
    });
    console.log("Filtered products:", filteredProducts.length);

    // Shuffle and pick up to 5
    const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error("Error fetching or processing products:", error);
    return []; // Return empty array on error
  }
};

const GiftFinderModal: React.FC<GiftFinderModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<GiftFinderSelections>({
    ageRange: null,
    gender: null,
    occasion: null,
    interests: []
  });
  const [suggestedGifts, setSuggestedGifts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSelectedStep, setLastSelectedStep] = useState<number | null>(null); // To track for auto-advance
  
  const totalSteps = 4; // Age, Gender, Occasion, Interests
  const stepLabels = ["Age", "Gender", "Occasion", "Interests"];
  const selectionKeys: (keyof GiftFinderSelections)[] = ['ageRange', 'gender', 'occasion', 'interests'];

  useEffect(() => {
    // Reset when modal opens
    if (isOpen) {
      setCurrentStep(1);
      setSelections({
        ageRange: null,
        gender: null,
        occasion: null,
        interests: []
      });
      setSuggestedGifts([]);
      setIsLoading(false);
      setError(null);
      setLastSelectedStep(null);
    }
  }, [isOpen]);

  const handleSelect = useCallback((field: keyof GiftFinderSelections, value: string) => {
    setSelections(prev => {
      let newSelectionsState = { ...prev };
      if (field === 'interests') {
        const currentInterests = prev.interests;
        if (currentInterests.includes(value)) {
          newSelectionsState = {
            ...prev,
            interests: currentInterests.filter(i => i !== value)
          };
        } else if (prev.interests.length < 5) { // Max 5 interests
          newSelectionsState = {
            ...prev,
            interests: [...currentInterests, value]
          };
        }
      } else {
        newSelectionsState = {
          ...prev,
          [field]: value
        };
      }
      
      if (suggestedGifts.length > 0) {
        setSuggestedGifts([]);
        setError(null);
      }
      return newSelectionsState;
    });

    if (field !== 'interests') {
        setLastSelectedStep(currentStep); // currentStep is the step where selection was made
    }
  }, [currentStep, suggestedGifts.length]);

  // Effect to handle auto-advancing and skipping answered questions
  useEffect(() => {
    if (lastSelectedStep === null || lastSelectedStep === totalSteps) { // No auto-advance from interests or if not triggered
      setLastSelectedStep(null); // Reset if it was totalSteps
      return;
    }

    let targetStep = totalSteps; // Default to last step (Interests)
    let foundNextUnanswered = false;

    // Start checking from the step *after* the one that was just selected
    for (let stepNumber = lastSelectedStep + 1; stepNumber <= totalSteps; stepNumber++) {
      const keyIndex = stepNumber - 1;
      const stepKey = selectionKeys[keyIndex];
      let isAnswered;
      if (stepKey === 'interests') {
        isAnswered = selections.interests.length > 0;
      } else {
        // selections[stepKey] might be stale here if setSelections hasn't updated the 'selections' state
        // for *this* render cycle yet. However, for *subsequent* steps, it's fine.
        // The selection for `lastSelectedStep` itself IS updated in `selections` by the time this effect runs.
        isAnswered = selections[stepKey] !== null;
      }

      if (!isAnswered) {
        targetStep = stepNumber;
        foundNextUnanswered = true;
        break;
      }
    }
    
    // If all subsequent steps were already answered, targetStep remains totalSteps.
    // If lastSelectedStep was already totalSteps-1 and interests is not filled, targetStep will be totalSteps.
    setCurrentStep(targetStep);
    setLastSelectedStep(null); // Reset the trigger

  }, [selections, lastSelectedStep, selectionKeys, totalSteps]);


  const navigateToStep = (step: number) => {
    if (isLoading) return;
    if (suggestedGifts.length > 0) {
      setSuggestedGifts([]); 
      setError(null);
    }
    setCurrentStep(step);
  };

  const handlePreviousStep = () => {
    if (suggestedGifts.length > 0) {
      setSuggestedGifts([]);
      setError(null);
      setCurrentStep(totalSteps); // Go to interests selection
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const findGifts = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestedGifts([]);
    try {
      const gifts = await fetchGiftSuggestions(selections);
      setSuggestedGifts(gifts);
      if (gifts.length === 0) {
        setError("No gifts found matching your criteria. Try broadening your selections!");
      }
    } catch (e) {
      console.error("Failed to fetch suggestions:", e);
      setError("Oops! Something went wrong while finding gifts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepSummaryText = (stepKey: keyof GiftFinderSelections) => {
    const value = selections[stepKey];
    if (stepKey === 'interests') {
      const interestsValue = value as string[];
      if (interestsValue.length === 0) return 'Not Selected';
      return interestsValue.length > 2 ? interestsValue.slice(0, 2).join(', ') + '...' : interestsValue.join(', ');
    }
    return value as string || 'Not Selected';
  };

  const renderStepContent = () => {
    if (isLoading) {
      return <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Finding the perfect gifts...</p>
        </div>;
    }
    if (error) {
      return <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
          <X className="h-16 w-16 text-destructive mb-4" />
          <p className="text-lg text-destructive-foreground">{error}</p>
           <Button onClick={() => {
          setError(null);
          setCurrentStep(totalSteps); 
          setSuggestedGifts([]);
        }} className="mt-4">
            Try Again
          </Button>
        </div>;
    }
    if (suggestedGifts.length > 0) {
      return <div className="animate-fade-in">
          <DialogHeader className="mb-4 text-center">
            <DialogTitle className="text-2xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-accent mr-2" /> Here are some ideas!
            </DialogTitle>
            <DialogDescription>We found these gifts based on your selections. You can edit selections or close.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
            {suggestedGifts.map(gift => <ProductCard key={gift.id} product={gift} />)}
          </div>
        </div>;
    }

    switch (currentStep) {
      case 1:
        return <BubbleSelect label="Who is the gift for? (Age Range)" options={ageRanges} selectedValue={selections.ageRange} onSelect={val => handleSelect('ageRange', val)} />;
      case 2:
        return <BubbleSelect label="Recipient's Gender" options={genders} selectedValue={selections.gender} onSelect={val => handleSelect('gender', val)} />;
      case 3:
        return <BubbleSelect label="What's the Occasion?" options={occasions} selectedValue={selections.occasion} onSelect={val => handleSelect('occasion', val)} />;
      case 4:
        return <BubbleSelect label="Their Interests (Select up to 5)" options={interestsList} selectedValue={selections.interests} onSelect={val => handleSelect('interests', val)} isMultiSelect maxSelections={5} />;
      default:
        return null;
    }
  };
  
  const isFindGiftsDisabled = () => {
    return selections.interests.length === 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 animate-pop-in">
        <div className="p-6 py-[12px]">
          {suggestedGifts.length === 0 && !isLoading && !error && (
            <>
              <DialogHeader className="mb-2 text-center">
                <DialogTitle className="text-2xl">Let's Find The Perfect Gift!</DialogTitle>
                <DialogDescription>
                  Answer a few questions and we'll suggest some ideas.
                </DialogDescription>
              </DialogHeader>
              <div className="px-1 mb-4 mt-3 flex flex-wrap justify-center items-center gap-x-1 gap-y-1 md:gap-x-2 text-xs md:text-sm border-y border-border py-3 -mx-6 bg-muted/30">
                {selectionKeys.map((key, index) => {
                  const stepForButton = index + 1;
                  const isCompleted = selections[key] !== null && (key !== 'interests' || (selections[key] as string[]).length > 0);
                  
                  // Logic to determine if this step summary button should be shown:
                  // 1. It's a previous step OR the current step.
                  // 2. OR It's the next immediate step (currentStep + 1) and currentStep is not the last questionnaire step.
                  // 3. OR It's any step that has already been completed (isCompleted is true).
                  const shouldShowButton = 
                    stepForButton <= currentStep ||
                    (stepForButton === currentStep + 1 && currentStep < totalSteps) ||
                    isCompleted;

                  if (!shouldShowButton) {
                    return null; // Don't render this button yet
                  }

                  return (
                    <React.Fragment key={key}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateToStep(stepForButton)}
                        className={cn(
                          "h-auto px-2 py-1 text-left !text-xs md:!text-sm whitespace-normal",
                          currentStep === stepForButton ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/50" : "hover:bg-accent/50",
                           isCompleted ? (currentStep === stepForButton ? "text-primary" : "text-primary/80") : "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {stepLabels[index]}: {getStepSummaryText(key)}
                      </Button>
                      {/* Show separator if this button is shown and it's not the last conceptual step in the summary bar */}
                      {stepForButton < totalSteps && 
                       ( (stepForButton + 1 <= currentStep) || // Next step is also a past/current step
                         (stepForButton + 1 === currentStep + 1 && currentStep + 1 < totalSteps +1) || // Next step is the upcoming one
                         (selections[selectionKeys[index+1]] !== null && (selectionKeys[index+1] !== 'interests' || (selections[selectionKeys[index+1]] as string[]).length > 0)) // Next step is completed
                       ) &&
                       <span className="text-muted-foreground/30 text-base leading-none align-middle">›</span>
                      }
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          )}
          
          <div className="min-h-[200px] flex flex-col justify-center">
             {renderStepContent()}
          </div>
        </div>

        {!isLoading && !error && (
          <DialogFooter className="p-6 bg-muted/50 border-t py-[6px]">
            {(currentStep > 1 || suggestedGifts.length > 0) && (
              <Button variant="outline" onClick={handlePreviousStep}>
                {suggestedGifts.length > 0 ? "Edit Selections" : "Previous"}
              </Button>
            )}
            {suggestedGifts.length === 0 && currentStep === totalSteps && (
              <Button onClick={findGifts} disabled={isFindGiftsDisabled()}>
                Find Gifts <Search className="ml-2 h-4 w-4" />
              </Button>
            )}
            {suggestedGifts.length > 0 && (
              <Button onClick={onClose}>Close</Button>
            )}
          </DialogFooter>
        )}
         {(isLoading || error) && suggestedGifts.length === 0 && (
           <DialogFooter className="p-6 bg-muted/50 border-t justify-center">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
           </DialogFooter>
         )}
      </DialogContent>
    </Dialog>
  );
};
export default GiftFinderModal;
