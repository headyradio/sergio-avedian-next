import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Users } from "lucide-react";

interface Webinar {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  isUpcoming: boolean;
  description: string;
}

interface WebinarCardProps {
  webinar: Webinar;
}

const WebinarCard = ({ webinar }: WebinarCardProps) => {
  return (
    <Card className="card-modern h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <Badge variant={webinar.isUpcoming ? "default" : "secondary"} className="text-xs">
            {webinar.isUpcoming ? "Upcoming" : "Available"}
          </Badge>
          <div className="flex items-center text-primary font-bold">
            <DollarSign className="w-4 h-4" />
            {webinar.price}
          </div>
        </div>
        
        <CardTitle className="text-lg leading-tight">{webinar.title}</CardTitle>
        <CardDescription className="text-text-secondary">
          {webinar.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 text-primary" />
            {webinar.date}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="w-4 h-4 text-primary" />
            {webinar.time} • {webinar.duration}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Users className="w-4 h-4 text-primary" />
            Interactive Q&A Session
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          variant={webinar.isUpcoming ? "default" : "outline"}
          size="lg"
        >
          {webinar.isUpcoming ? `Register - $${webinar.price}` : `Watch Replay - $${webinar.price}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebinarCard;