import { gql } from '../../../shared/services/graphqlApi/__generated/gql';

export const STRIPE_ALL_CHARGES = gql(/* GraphQL */ `
  query stripeAllChargesQuery {
    allCharges {
      edges {
        node {
          id
          ...stripeChargeFragment
        }
      }
    }
  }
`);

export const STRIPE_CHARGE_FRAGMENT = gql(/* GraphQL */ `
  fragment stripeChargeFragment on StripeChargeType {
    id
    created
    billingDetails
    paymentMethod {
      ...stripePaymentMethodFragment
      id
    }
    amount
    invoice {
      id
      subscription {
        plan {
          ...subscriptionPlanItemFragment
        }
      }
    }
  }
`);

export const SUBSCRIPTION_PLAN_ITEM_FRAGMENT = gql(/* GraphQL */ `
  fragment subscriptionPlanItemFragment on SubscriptionPlanType {
    id
    pk
    product {
      id
      name
    }
    unitAmount
  }
`);