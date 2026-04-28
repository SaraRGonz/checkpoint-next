'use server'

import { z } from 'zod';

const ContactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email({ message:'Must be a valid email'}),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

const formatZodErrors = (error: z.ZodError) => {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const path = issue.path.join('.') || 'root';
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
    }
    return fieldErrors;
};

// prevState es obligatorio cuando se usa useActionState en el cliente
export async function sendContactAction(prevState: unknown, formData: FormData) {
    // extrae los datos del FormData nativo
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    };

    // usa safeParse en lugar de parseAsync para manejar el error sin try/catch
    const validatedFields = ContactSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: formatZodErrors(validatedFields.error),
            message: 'Please correct the errors in the form.'
        };
    }

    // simula un retraso de red y el envío (aquí iría Resend, SendGrid, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('📨 NEW CONTACT MESSAGE RECEIVED:', validatedFields.data);

    return { 
        success: true, 
        message: 'Message sent successfully! We will reply soon.' 
    };
}