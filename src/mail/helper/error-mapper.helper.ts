const resendErrorMessages: Record<string, string> = {
  missing_required_field: 'Missing required information to send the email.',
  invalid_idempotency_key: 'Invalid request. Please try again.',
  invalid_idempotent_request: 'Invalid request. Please try again.',
  concurrent_idempotent_requests:
    'Request in progress. Please try again shortly.',
  invalid_access: 'You do not have permission to perform this action.',
  invalid_parameter:
    'Some data provided is invalid. Please check and try again.',
  invalid_region: 'Selected region is not supported. Please contact support.',
  rate_limit_exceeded: 'Too many requests. Please wait and try again later.',
  missing_api_key: 'Service temporarily unavailable. Please try again later.',
  invalid_api_Key: 'Service temporarily unavailable. Please try again later.',
  invalid_from_address: 'Sender address is invalid. Please contact support.',
  validation_error:
    'Some information is invalid or your domain is not verified.',
  not_found: 'Requested resource was not found.',
  method_not_allowed: 'This operation is not allowed.',
  application_error: 'Unexpected error. Please try again later.',
  internal_server_error: 'Unexpected error. Please try again later.',
};

export function mapResendError(errorCode: string): string {
  return (
    resendErrorMessages[errorCode] ||
    'An error occurred while sending the email. Please try again later.'
  );
}
