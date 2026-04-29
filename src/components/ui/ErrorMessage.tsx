import { AlertIcon } from './Icons';

interface ErrorMessageProps {
    message: string;
    code?: string | number;
}

export function ErrorMessage({ message, code }: ErrorMessageProps) {
    return (
        <div className="bg-errorbg border-l-4 border-errortext p-4 my-4 rounded-md shadow-sm">
            <div className="flex items-center">
                <AlertIcon className="h-5 w-5 text-errortext mr-3" />
                
                <div>
                    {code && <span className="font-bold text-erroraccent mr-2">[{code}]</span>}
                    <span className="text-erroraccent">{message}</span>
                </div>
            </div>
        </div>
    );
}