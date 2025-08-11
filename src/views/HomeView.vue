<template>
  <div class="home">
    <h1>Stripe Payment Gateway</h1>
    <stripe-checkout
      mode="payment"
      :line-items="lineItems"
      :success-url="successUrl"
      :cancel-url="cancelUrl"
      @loading="loading = $event"
    >
      <button :disabled="loading">{{ loading ? 'Redirecting...' : 'Pay Now' }}</button>
    </stripe-checkout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      lineItems: [
        { price: 'price_1Rt7WoCpnBRvaWSUVXXZK8kJ', quantity: 1 }
      ],
      successUrl: 'http://localhost:8080/success',
      cancelUrl: 'http://localhost:8080/error'
    }
  }
}
</script>
