import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

const ContactFormModal = ({ isOpen, onClose, defaultSubject }: ContactFormModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Contact Sergio
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ContactForm defaultSubject={defaultSubject} onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;