import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BubbleSelect from './BubbleSelect';
import ProductCard from './ProductCard';
import { Product, GiftFinderSelections, ageRanges, genders, occasions, interestsList } from '@/types';
import { Loader2, Search, Sparkles, XCircle, Edit3, CheckCircle2 } from 'lucide-react';

interface GiftFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock LLM call / Product fetching logic
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
  const totalSteps = 4; // Age, Gender, Occasion, Interests

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
    }
  }, [isOpen]);

  const goToStep = useCallback((targetStep: number) => {
    setSuggestedGifts([]); // Clear results if any
    setError(null); // Clear error if any
    setIsLoading(false); // Ensure loading is reset

    const newSelections = { ...selections };
    if (targetStep <= 3) newSelections.interests = []; // Clear interests if going to/before occasion
    if (targetStep <= 2) newSelections.occasion = null; // Clear occasion if going to/before gender
    if (targetStep <= 1) newSelections.gender = null;   // Clear gender if going to age
    // ageRange is not cleared if targetStep is 1, user is editing it.
    
    setSelections(newSelections);
    setCurrentStep(targetStep);
  }, [selections]);
  
  const handleSelect = (field: keyof GiftFinderSelections, value: string) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      if (field === 'interests') {
        const currentInterests = prev.interests;
        if (currentInterests.includes(value)) {
          newSelections.interests = currentInterests.filter(i => i !== value);
        } else if (newSelections.interests.length < 5) { // Max 5 interests
          newSelections.interests = [...currentInterests, value];
        }
      } else {
        (newSelections[field] as string | null) = value;
      }
      return newSelections;
    });
  };

  // Auto-advance effect
  useEffect(() => {
    if (isLoading || error || suggestedGifts.length > 0) return;

    if (currentStep === 1 && selections.ageRange) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selections.gender) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selections.occasion) {
      setCurrentStep(4);
    }
    // Step 4 (Interests) does not auto-advance to results. User clicks "Find Gifts".
  }, [selections, currentStep, isLoading, error, suggestedGifts.length]);


  const handlePreviousStep = () => {
    if (suggestedGifts.length > 0) {
      setSuggestedGifts([]);
      setError(null);
      setCurrentStep(totalSteps); // Go back to interests selection
      return;
    }
    if (currentStep > 1) {
      goToStep(currentStep - 1);
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

  const SelectionsSummary: React.FC = () => {
    if (isLoading || error || suggestedGifts.length > 0 || currentStep === 1 && !selections.ageRange) {
      return null;
    }

    const summaryItems = [
      { label: "Age", value: selections.ageRange, step: 1 },
      { label: "Gender", value: selections.gender, step: 2 },
      { label: "Occasion", value: selections.occasion, step: 3 },
      { label: "Interests", value: selections.interests.join(', '), step: 4, isList: true },
    ];

    return (
      <div className="mb-4 p-3 bg-muted/10 rounded-lg border border-muted text-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {summaryItems.map(item => {
          if (!item.value || (item.isList && selections.interests.length === 0)) return null;
          
          const isCurrentStepSelection = item.step === currentStep;
          const isCompletedStep = selections.ageRange && item.step === 1 ||
                                  selections.gender && item.step === 2 ||
                                  selections.occasion && item.step === 3 ||
                                  selections.interests.length > 0 && item.step === 4;

          return (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={`p-1 h-auto text-xs ${isCurrentStepSelection ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => goToStep(item.step)}
              title={`Edit ${item.label}`}
            >
              {isCompletedStep && !isCurrentStepSelection ? <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> : <Edit3 className="w-3 h-3 mr-1" />}
              {item.label}: {item.value}
            </Button>
          );
        })}
        </div>
      </div>
    );
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
          <XCircle className="h-16 w-16 text-destructive mb-4" />
          <p className="text-lg text-destructive-foreground">{error}</p>
           <Button onClick={() => {
          setError(null);
          goToStep(totalSteps); 
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
            <DialogDescription>We found these gifts based on your selections.</DialogDescription>
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
    // Only for step 4
    return currentStep === totalSteps && selections.interests.length === 0;
  };

  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 animate-pop-in">
        <div className="p-6 py-[12px]">
          {suggestedGifts.length === 0 && !isLoading && !error && 
            <DialogHeader className="mb-2 text-center">
              <DialogTitle className="text-2xl">Let's Find The Perfect Gift!</DialogTitle>
              <DialogDescription>
                Answer a few questions and we'll suggest some ideas.
                {` Step ${currentStep} of ${totalSteps}.`}
              </DialogDescription>
            </DialogHeader>
          }
          {!isLoading && !error && suggestedGifts.length === 0 && <SelectionsSummary />}
          
          <div className="min-h-[200px] flex flex-col justify-center">
             {renderStepContent()}
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/50 border-t py-[6px]">
            {isLoading || error ? (
              <div className="flex justify-center w-full">
                 <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                 </DialogClose>
              </div>
            ) : suggestedGifts.length > 0 ? (
              <>
                <Button variant="outline" onClick={handlePreviousStep}>
                  Edit Selections
                </Button>
                <DialogClose asChild>
                    <Button>Close</Button>
                </DialogClose>
              </>
            ) : (
              <>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Previous
                  </Button>
                )}
                {currentStep === 1 && <div className="flex-grow"></div>} 
                
                {currentStep === totalSteps && (
                  <Button onClick={findGifts} disabled={isFindGiftsDisabled()}>
                    Find Gifts
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default GiftFinderModal;
