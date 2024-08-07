export type OrderValidationResponse = {
  valid: boolean
  errorString?: string
}

export type CreateOrderResponse = {
  success: boolean,
  error?: string
}
