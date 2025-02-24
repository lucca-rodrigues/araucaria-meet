import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "@/contexts/globalContext";

export default function useDashboard() {
  const { plans, getPaymentPlans, subscriptions, getSubscriptions } = useGlobalStore();

  const navigate = useNavigate();

  const calculateMonthlyRevenue = () => {
    return subscriptions.reduce((total, subscription) => {
      return total + Number(subscription.amount);
    }, 0);
  };

  return {
    navigate,
    plans,
    subscriptions,
    monthlyRevenue: calculateMonthlyRevenue(),
    getPaymentPlans,
    getSubscriptions,
  };
}
