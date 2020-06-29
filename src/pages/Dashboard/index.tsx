import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');
      const balanceResponse = response.data.balance;
      const transactionsResponse = response.data.transactions;

      const balanceFormatted: Balance = {
        income: formatValue(balanceResponse.income),
        outcome: formatValue(balanceResponse.outcome),
        total: formatValue(balanceResponse.total),
      };

      const transactionsFormatted = transactionsResponse.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedDate: new Date(transaction.created_at).toLocaleDateString(
            'pt-BR',
          ),
          formattedValue:
            transaction.type === 'income'
              ? formatValue(transaction.value)
              : `- ${formatValue(transaction.value)}`,
        }),
      );

      setBalance(balanceFormatted);
      setTransactions(transactionsFormatted);
    }

    loadTransactions();
  }, []);

  async function handleDeleteTransaction(id: string): Promise<void> {
    const response = await api.delete(`/transactions/${id}`);

    if (response.status !== 204) {
      throw Error('erro ao deletar');
    }

    const newTransactions = transactions.filter(
      transaction => transaction.id !== id,
    );

    const incomeUpdated = newTransactions.reduce(
      (count, transaction) =>
        transaction.type === 'income' ? transaction.value + count : count,
      0,
    );

    const outcomeUpdated = newTransactions.reduce(
      (count, transaction) =>
        transaction.type === 'outcome' ? transaction.value + count : count,
      0,
    );

    const totalUpdated = incomeUpdated - outcomeUpdated;

    const newBalance: Balance = {
      income: formatValue(incomeUpdated),
      outcome: formatValue(outcomeUpdated),
      total: formatValue(totalUpdated),
    };
    setBalance(newBalance);
    setTransactions(newTransactions);
  }

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td className="data">{transaction.formattedDate}</td>
                    <td className="button">
                      <button
                        type="submit"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <span>Deletar</span>
                        <FaTrashAlt size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
