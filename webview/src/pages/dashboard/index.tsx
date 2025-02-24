import { useAuth } from "../../contexts/authContext";

const mockData = {
  totalUsers: 1234,
  activeUsers: 789,
  totalRevenue: "R$ 50.000,00",
  monthlyGrowth: "15%",
};

export function Dashboard() {
  const user = useAuth((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Total de Usuários</h3>
          <p className="text-2xl font-semibold">{mockData.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Usuários Ativos</h3>
          <p className="text-2xl font-semibold">{mockData.activeUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Receita Total</h3>
          <p className="text-2xl font-semibold">{mockData.totalRevenue}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Crescimento Mensal</h3>
          <p className="text-2xl font-semibold text-green-500">{mockData.monthlyGrowth}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Ação #{item}</p>
                <p className="text-sm text-gray-500">Descrição da atividade {item}</p>
              </div>
              <span className="text-sm text-gray-500">há {item} hora(s)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
