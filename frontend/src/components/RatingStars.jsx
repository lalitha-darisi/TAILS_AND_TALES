import React, { useState } from 'react';
import { Star, Sparkles, Heart } from 'lucide-react';

export default function RatingStars({ 
  initialRating = 0, 
  onRate, 
  size = 'md',
  showLabel = true,
  readonly = false,
  type = 'pet' // 'pet' or 'app'
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Size configurations
  const sizes = {
    sm: { star: 20, gap: 'gap-1', text: 'text-sm' },
    md: { star: 32, gap: 'gap-2', text: 'text-lg' },
    lg: { star: 40, gap: 'gap-3', text: 'text-xl' }
  };

  const config = sizes[size] || sizes.md;

  const handleClick = async (value) => {
    if (readonly || isSubmitting) return;
    
    setIsSubmitting(true);
    setRating(value);
    
    if (onRate) {
      await onRate(value);
    }
    
    setIsSubmitting(false);
  };

  const labels = [
    'Poor',
    'Fair', 
    'Good',
    'Very Good',
    'Excellent'
  ];

  const displayRating = hoverRating || rating;

  return (
    <div className="inline-flex flex-col items-center">
      {/* Stars */}
      <div className={`flex ${config.gap} items-center mb-2`}>
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= displayRating;
          const isHovered = value <= hoverRating;
          
          return (
            <button
              key={value}
              onClick={() => handleClick(value)}
              onMouseEnter={() => !readonly && setHoverRating(value)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
              disabled={readonly || isSubmitting}
              className={`
                transform transition-all duration-200
                ${!readonly && 'hover:scale-125 cursor-pointer'}
                ${readonly && 'cursor-default'}
                ${isSubmitting && 'opacity-50'}
              `}
              aria-label={`Rate ${value} stars`}
            >
              <Star
                size={config.star}
                className={`
                  transition-all duration-200
                  ${isFilled 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                  }
                  ${isHovered && 'drop-shadow-lg animate-pulse'}
                `}
              />
            </button>
          );
        })}
      </div>

      {/* Label */}
      {showLabel && displayRating > 0 && (
        <div className={`${config.text} font-semibold text-center`}>
          <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            {labels[displayRating - 1]}
          </span>
          {!readonly && hoverRating === 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {type === 'pet' ? 'Your rating for this pet' : 'Your app rating'}
            </div>
          )}
        </div>
      )}

      {/* Prompt text for unrated */}
      {showLabel && displayRating === 0 && !readonly && (
        <div className={`${config.text} text-gray-400 text-center`}>
          {type === 'pet' ? 'Rate this pet' : 'Rate your experience'}
        </div>
      )}

      {/* Submitting indicator */}
      {isSubmitting && (
        <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Saving...</span>
        </div>
      )}
    </div>
  );
}

// Pet Rating Card Component
export function PetRatingCard({ petName, petId, onSubmitRating }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    await onSubmitRating({ petId, rating, comment });
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      setRating(0);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border-2 border-green-200 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Heart className="text-white fill-white" size={32} />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600">
          Your rating for <span className="font-bold text-pink-600">{petName}</span> has been submitted! 🐾
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Rate Your Experience</h3>
          <p className="text-gray-600">How was <span className="font-bold text-pink-600">{petName}</span>?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Rating Stars */}
        <div className="flex justify-center py-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
          <RatingStars 
            initialRating={rating}
            onRate={setRating}
            size="lg"
            type="pet"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Share your thoughts (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Tell us about your experience with ${petName}...`}
            rows={4}
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Star size={22} className="fill-white" />
          Submit Rating
          <Sparkles size={20} />
        </button>
      </div>
    </div>
  );
}

// App Rating Card Component
export function AppRatingCard({ onSubmitRating }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    await onSubmitRating({ rating, comment });
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      setRating(0);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Sparkles className="text-white" size={32} />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          We Appreciate Your Feedback!
        </h3>
        <p className="text-gray-600">
          Thank you for helping us improve PetAdopt! 💜
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
          <Heart className="text-white fill-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Rate PetAdopt</h3>
          <p className="text-gray-600">How's your experience with our app?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Rating Stars */}
        <div className="flex justify-center py-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <RatingStars 
            initialRating={rating}
            onRate={setRating}
            size="lg"
            type="app"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What did you like or dislike? (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about PetAdopt..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Heart size={22} className="fill-white" />
          Submit App Rating
          <Sparkles size={20} />
        </button>
      </div>
    </div>
  );
}