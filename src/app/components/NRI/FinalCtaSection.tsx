import React from 'react';
import { ShoppingCtaSection } from '../ShoppingCtaSection';

interface FinalCtaSectionProps {
  onOpenConsultation: () => void;
  onStartBooking: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenConsultation,
  onStartBooking,
}) => (
  <ShoppingCtaSection
    variant="nri"
    onOpenConsultation={onOpenConsultation}
    onStartBooking={onStartBooking}
  />
);
