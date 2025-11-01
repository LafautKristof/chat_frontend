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
            <RegisterFormCredentials />

            <RegisterFormGoogleGithub />
        </>
    );
}
