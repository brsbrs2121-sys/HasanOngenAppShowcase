
export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

/**
 * A custom error class to represent Firestore permission errors with rich context.
 * This helps in debugging security rules by providing detailed information about the denied request.
 */
export class FirestorePermissionError extends Error {
    public context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `Firestore Permission Denied: Operation '${context.operation}' on path '${context.path}' was blocked by security rules.`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;

        // This is to ensure the prototype chain is correctly set up for extending built-in classes.
        Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    }
}
