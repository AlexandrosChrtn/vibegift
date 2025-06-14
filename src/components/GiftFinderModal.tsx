
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BubbleSelect from './BubbleSelect';
import ProductCard from './ProductCard';
import { Product, GiftFinderSelections, ageRanges, genders, occasions, interestsList } from '@/types';
import { Loader2, Search, Sparkles, X } from 'lucide-react';

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
      const interestMatch = selections.interests.length > 0
        ? selections.interests.some(interest => product.interests.includes(interest))
        : true;
      
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


const GiftFinderModal: React.FC<GiftFinderModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<GiftFinderSelections>({
    ageRange: null,
    gender: null,
    occasion: null,
    interests: [],
  });
  const [suggestedGifts, setSuggestedGifts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4; // Age, Gender, Occasion, Interests

  useEffect(() => {
    // Reset when modal opens
    if (isOpen) {
      setCurrentStep(1);
      setSelections({ ageRange: null, gender: null, occasion: null, interests: [] });
      setSuggestedGifts([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSelect = (field: keyof GiftFinderSelections, value: string) => {
    setSelections(prev => {
      if (field === 'interests') {
        const currentInterests = prev.interests;
        if (currentInterests.includes(value)) {
          return { ...prev, interests: currentInterests.filter(i => i !== value) };
        }
        return { ...prev, interests: [...currentInterests, value].slice(0, 5) }; // Max 5 interests
      }
      return { ...prev, [field]: value };
    });
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step, find gifts
      findGifts();
    }
  };
  
  const handlePreviousStep = () => {
    if (suggestedGifts.length > 0) { // If showing results, go back to interest selection
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

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Finding the perfect gifts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
          <X className="h-16 w-16 text-destructive mb-4" />
          <p className="text-lg text-destructive-foreground">{error}</p>
           <Button onClick={() => { setError(null); setCurrentStep(totalSteps); setSuggestedGifts([]); }} className="mt-4">
            Try Again
          </Button>
        </div>
      );
    }

    if (suggestedGifts.length > 0) {
      return (
        <div className="animate-fade-in">
          <DialogHeader className="mb-4 text-center">
            <DialogTitle className="text-2xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-accent mr-2" /> Here are some ideas!
            </DialogTitle>
            <DialogDescription>We found these gifts based on your selections.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
            {suggestedGifts.map(gift => <ProductCard key={gift.id} product={gift} />)}
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <BubbleSelect label="Who is the gift for? (Age Range)" options={ageRanges} selectedValue={selections.ageRange} onSelect={(val) => handleSelect('ageRange', val)} />;
      case 2:
        return <BubbleSelect label="Recipient's Gender" options={genders} selectedValue={selections.gender} onSelect={(val) => handleSelect('gender', val)} />;
      case 3:
        return <BubbleSelect label="What's the Occasion?" options={occasions} selectedValue={selections.occasion} onSelect={(val) => handleSelect('occasion', val)} />;
      case 4:
        return <BubbleSelect label="Their Interests (Select up to 5)" options={interestsList} selectedValue={selections.interests} onSelect={(val) => handleSelect('interests', val)} isMultiSelect maxSelections={5} />;
      default:
        return null;
    }
  };
  
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: return !selections.ageRange;
      case 2: return !selections.gender;
      case 3: return !selections.occasion;
      case 4: return selections.interests.length === 0;
      default: return false;
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 animate-pop-in">
        <div className="p-6">
          {suggestedGifts.length === 0 && !isLoading && !error && (
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl">Let's Find The Perfect Gift!</DialogTitle>
              <DialogDescription>
                Answer a few questions and we'll suggest some ideas. Step {currentStep} of {totalSteps}.
              </DialogDescription>
            </DialogHeader>
          )}
          
          <div className="min-h-[200px] flex flex-col justify-center">
             {renderStepContent()}
          </div>
        </div>

        {!isLoading && !error && (
           <DialogFooter className="p-6 bg-muted/50 border-t">
            {(currentStep > 1 || suggestedGifts.length > 0) && (
              <Button variant="outline" onClick={handlePreviousStep}>
                {suggestedGifts.length > 0 ? "Edit Selections" : "Previous"}
              </Button>
            )}
            {suggestedGifts.length === 0 && (
              <Button onClick={handleNextStep} disabled={isNextDisabled()}>
                {currentStep === totalSteps ? "Find Gifts" : "Next"}
                {currentStep === totalSteps && <Search className="ml-2 h-4 w-4" />}
              </Button>
            )}
            {suggestedGifts.length > 0 && (
               <Button onClick={onClose}>Close</Button>
            )}
          </DialogFooter>
        )}
         { (isLoading || error) && suggestedGifts.length === 0 && (
           <DialogFooter className="p-6 bg-muted/50 border-t justify-center">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
           </DialogFooter>
         )}
      </DialogContent>
    </Dialog>
  );
};

export default GiftFinderModal;

