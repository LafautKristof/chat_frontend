import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import RegisterFormCredentials from "./RegisterFormCredentials";
import RegisterFormGoogleGithub from "./RegisterFormGoogleGithub";
export default function RegisterForm() {
    return (
        <>
            <Accordion type="single">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                        <RegisterFormCredentials />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                        <RegisterFormGoogleGithub />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
}
