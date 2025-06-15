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

// Updated product fetching logic
const fetchGiftSuggestions = async (selections: GiftFinderSelections): Promise<Product[]> => {
  console.log("Fetching gifts with selections:", selections);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  try {
    const response = await fetch('/products.json');
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} while fetching products.json`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allProducts: Product[] = await response.json();
    console.log("All products fetched:", allProducts.length);

    if (allProducts.length === 0) {
      console.warn("No products available in products.json");
      return []; // Return empty if the product list itself is empty
    }
    
    // Determine the number of products to show, up to 6, but not more than available
    const minProductsToShow = Math.min(6, allProducts.length);

    const filteredProducts = allProducts.filter(product => {
      const ageMatch = selections.ageRange ? product.ageRange.includes(selections.ageRange) : true;
      const genderMatch = selections.gender ? product.gender.includes(selections.gender) : true;
      const occasionMatch = selections.occasion ? product.occasion.includes(selections.occasion) : true;
      const interestMatch = selections.interests.length > 0 
        ? selections.interests.some(interest => product.interests.includes(interest)) 
        : true;
      return ageMatch && genderMatch && occasionMatch && interestMatch;
    });
    console.log("Filtered products based on criteria:", filteredProducts.length);

    let suggestedGifts: Product[] = [];

    if (filteredProducts.length > 0) {
      // Shuffle filtered products and take up to minProductsToShow
      const shuffledFiltered = [...filteredProducts].sort(() => 0.5 - Math.random());
      suggestedGifts = shuffledFiltered.slice(0, minProductsToShow);
    }

    // If not enough gifts from filtered list, supplement with random products from allProducts
    if (suggestedGifts.length < minProductsToShow) {
      const remainingNeeded = minProductsToShow - suggestedGifts.length;
      // Get products from allProducts that are not already in suggestedGifts
      const suggestedGiftIds = new Set(suggestedGifts.map(p => p.id));
      const complementaryProducts = allProducts.filter(p => !suggestedGiftIds.has(p.id));
      
      const shuffledComplementary = [...complementaryProducts].sort(() => 0.5 - Math.random());
      suggestedGifts.push(...shuffledComplementary.slice(0, remainingNeeded));
    }
    
    console.log("Final suggested gifts count:", suggestedGifts.length);
    return suggestedGifts;

  } catch (error) {
    console.error("Error fetching or processing products in fetchGiftSuggestions:", error);
    // On any error during fetching/processing, return empty array.
    // The calling function (findGifts) will handle displaying a generic error to the user.
    return []; 
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
        isAnswered = selections[stepKey] !== null;
      }

      if (!isAnswered) {
        targetStep = stepNumber;
        foundNextUnanswered = true;
        break;
      }
    }
    
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
      if (gifts.length > 0) {
        setSuggestedGifts(gifts);
      } else {
        // This case implies a fundamental issue with fetching or no products in products.json
        setError("We couldn't retrieve gift suggestions at this time. Please try again later.");
      }
    } catch (e) {
      // Catch unexpected errors from the findGifts async process itself
      console.error("An unexpected error occurred while finding gifts:", e);
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
          // If error on results, try again should ideally reset to selection or a relevant step.
          // For now, simplest is to allow re-triggering findGifts if on last step, or let user navigate.
          if(currentStep !== totalSteps && suggestedGifts.length === 0) {
            setCurrentStep(totalSteps); // Go to interests if error wasn't on results view
          }
          // If error was on results view, findGifts can be re-triggered if applicable.
          // Or user can edit selections.
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
    // Example: require at least one interest or other criteria if desired
    // For now, consistent with previous logic:
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
              <div className="px-1 mb-4 mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm border-y border-border py-3 -mx-6 bg-muted/30">
                {selectionKeys.map((key, index) => {
                  const stepForButton = index + 1;
                  const isCompleted = selections[key] !== null && (key !== 'interests' || (selections[key] as string[]).length > 0);
                  
                  const shouldShowButton = 
                    stepForButton <= currentStep || 
                    isCompleted;                   

                  if (!shouldShowButton) {
                    return null;
                  }

                  return (
                      <Button
                        key={key}
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateToStep(stepForButton)}
                        className={cn(
                          "h-auto px-2 py-1 text-left !text-xs md:!text-sm whitespace-normal justify-start",
                          currentStep === stepForButton ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/50" : "hover:bg-accent/50",
                           isCompleted ? (currentStep === stepForButton ? "text-primary" : "text-primary/80") : "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {stepLabels[index]}: {getStepSummaryText(key)}
                      </Button>
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
