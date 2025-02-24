import { CreditCard, TrendingUp, Users } from "lucide-react";
import { TSubscription } from "@/pages/subscriptions/domain/models";

type Plan = {
  id: string;
  name: string;
  price: string;
  typePlan: string;
  recurrencyType: string;
  recurrencyPeriod: number;
};

interface TemplateProps {
  plans: Plan[];
  subscriptions: TSubscription[];
  monthlyRevenue: number;
}

export default function TemplatePage({ plans, subscriptions, monthlyRevenue }: TemplateProps) {
  const stats = [
    {
      name: "Total de Planos Cadastrados",
      value: plans.length ?? 0,
      icon: CreditCard,
    },
    {
      name: "Assinaturas Ativas",
      value: subscriptions?.filter((sub) => sub?.status === "paid").length ?? 0,
      icon: Users,
    },
    {
      name: "Receita Mensal",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(monthlyRevenue),
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Painel de Controle</h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
            <dt>
              <div className="absolute bg-primary rounded-md p-3">
                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Assinaturas Recentes</h2>
        <div className="mt-4 bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions
                .sort((a, b) => new Date(b?.transactionDate).getTime() - new Date(a?.transactionDate).getTime())
                .slice(0, 3)
                .map((item) => (
                  <tr key={item?.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item?.user?.name || "Usuário não encontrado"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item?.paymentPlan?.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.paymentPlan?.price))}
                        /{item.paymentPlan?.recurrencyType === "month" ? "mês" : "ano"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item?.status === "paid" ? "Pago" : item?.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item?.transactionDate).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
