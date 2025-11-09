
import React, { useState } from 'react';
import { PricingConfig, User } from '../types';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Button } from './common/Button';

interface AdminPanelProps {
  pricingConfig: PricingConfig;
  setPricingConfig: (config: PricingConfig) => void;
  allUsers: User[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ pricingConfig, setPricingConfig, allUsers }) => {
  const [localConfig, setLocalConfig] = useState<PricingConfig>(pricingConfig);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalConfig(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleSave = () => {
    setPricingConfig(localConfig);
    alert('Configurações de preço salvas com sucesso!');
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Painel de Gerenciamento</h1>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Simulador de Corrida - Configuração de Preços</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-bold text-lg">Carro</h3>
            <Input label="Valor Mínimo por KM (R$)" type="number" name="carMinKmRate" value={localConfig.carMinKmRate} onChange={handleChange} />
            <Input label="Valor Mínimo da Corrida (R$)" type="number" name="carMinFare" value={localConfig.carMinFare} onChange={handleChange} />
            <Input label="Ganho Mínimo por Hora (R$)" type="number" name="carMinHourlyRate" value={localConfig.carMinHourlyRate} onChange={handleChange} />
          </div>
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-bold text-lg">Moto</h3>
            <Input label="Valor Mínimo por KM (R$)" type="number" name="motoMinKmRate" value={localConfig.motoMinKmRate} onChange={handleChange} />
            <Input label="Valor Mínimo da Corrida (R$)" type="number" name="motoMinFare" value={localConfig.motoMinFare} onChange={handleChange} />
            <Input label="Ganho Mínimo por Hora (R$)" type="number" name="motoMinHourlyRate" value={localConfig.motoMinHourlyRate} onChange={handleChange} />
          </div>
        </div>
        <Button onClick={handleSave} className="mt-6">Salvar Configurações</Button>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Usuários Registrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Nome</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">Nível</th>
                <th className="p-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">Nível {user.profileLevel}</td>
                  <td className="p-3">{user.rating.toFixed(2)} ⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
