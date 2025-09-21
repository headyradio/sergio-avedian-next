import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  outcomes: string[];
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="card-premium h-full flex flex-col">
      <div className="aspect-video bg-surface-secondary rounded-t-lg overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJoc2woMjIwIDIwJSA2JSkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxOCIgZmlsbD0iaHNsKDAgMCUgNzUlKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdXJzZSBJbWFnZTwvdGV4dD48L3N2Zz4=";
          }}
        />
      </div>
      
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {course.duration}
          </Badge>
          <div className="flex items-center text-primary font-bold text-lg">
            <DollarSign className="w-4 h-4" />
            {course.price}
          </div>
        </div>
        
        <CardTitle className="text-xl mb-3">{course.title}</CardTitle>
        <CardDescription className="text-base text-text-secondary">
          {course.description}
        </CardDescription>
        
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-sm text-foreground">What You'll Learn:</h4>
          <ul className="space-y-1">
            {course.outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </CardHeader>
      
      <CardFooter className="pt-0">
        <Button className="w-full cta-electric" size="lg">
          Enroll Now - ${course.price}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;