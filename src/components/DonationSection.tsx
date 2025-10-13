import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface DonationSectionProps {
  upiId?: string;
  buyMeACoffeeUrl?: string;
  paypalUrl?: string;
  razorpayUrl?: string;
  upiQrSrc?: string; // defaults to /upi-qr.jpg in public
}

export const DonationSection: React.FC<DonationSectionProps> = ({
  upiId = '9430253372@fam',
  buyMeACoffeeUrl = 'https://www.buymeacoffee.com/yourid',
  paypalUrl,
  razorpayUrl,
  upiQrSrc = '/upi-qr.jpg',
}) => {
  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success('UPI ID copied');
    } catch {
      toast.error('Failed to copy UPI ID');
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary" />
          Buy Me a Coffee / Support This Project
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Scan the UPI QR to donate instantly</p>
          <div className="rounded-lg border p-3 bg-card">
            <img src={upiQrSrc} alt="UPI QR" className="w-full max-w-xs mx-auto rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{upiId}</Badge>
            <Button size="sm" variant="outline" onClick={copyUpi}>
              <Copy className="w-4 h-4 mr-2" />
              Copy UPI
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Place your QR image at public/upi-qr.jpg or pass a custom upiQrSrc prop.</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Prefer other options?</p>
          <div className="grid gap-2">
            <a href={buyMeACoffeeUrl} target="_blank" rel="noreferrer">
              <Button className="w-full">
                <Coffee className="w-4 h-4 mr-2" /> Buy Me a Coffee
                <ExternalLink className="w-4 h-4 ml-2 opacity-75" />
              </Button>
            </a>
            {razorpayUrl && (
              <a href={razorpayUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full">
                  Razorpay
                  <ExternalLink className="w-4 h-4 ml-2 opacity-75" />
                </Button>
              </a>
            )}
            {paypalUrl && (
              <a href={paypalUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full">
                  PayPal
                  <ExternalLink className="w-4 h-4 ml-2 opacity-75" />
                </Button>
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Your support helps keep development active. Thank you!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationSection;


