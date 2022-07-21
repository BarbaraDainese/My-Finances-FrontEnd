import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import FinancesTable from "../components/FinancesTable";

import { Box, Container, Heading, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import NewExpenseModal from "../components/NewExpenseModal";
import { useEffect, useState } from "react";
import { IExpenses } from "../models/IExpense";
import { api, getExpenses, removeExpense } from "../services/api";
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [expenses, setExpenses] = useState<IExpenses[]>([]);
  const [expenseToEdit, setExpenseToEdit] = useState<IExpenses>();
  const [loading, setLoading] = useState(true);

  function fetchExpenses (){
    getExpenses()
    .then(expenseList => setExpenses(expenseList))
    .finally(function () {
      setLoading(false);
    });
    
  }

  useEffect(() => {
    
    fetchExpenses();
    
  }, []);

  console.log(expenses);

  return (
    <div className={styles.container}>
      
      <Head>
        <title>My finances</title>
        <meta name="description" content="Vnt 4tech 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        <Heading as="h2" mb="100px">
          My Finances
        </Heading>
        
          <FinancesTable
          expenses={expenses}
          onAddExpense={() => onOpen()}
          onEditExpense={(expense) => {
            setExpenseToEdit(expense);
            onOpen();
          }}
          onRemoveExpense={async (expense) => {
            await removeExpense(expense);
            setLoading(true);
            fetchExpenses();
            
            
            
            toast({
              title: "Despesa excluida",
              description: "Despesa foi excluida com sucesso",
              status: "info",
              position: "top-right",
          })
            
          
          }}
        />
        <div>
          <Container >
            <Box padding='10'>
            {loading && <Spinner size='xl'/>}
            </Box>
          
          </Container> 
        </div>
        
        
        
        <NewExpenseModal
          isOpen={isOpen}
          expense={expenseToEdit}
          onSave={() => {
            fetchExpenses();
            onClose();
            setExpenseToEdit(undefined);
          }}
          onClose={() => {
            onClose();
            setExpenseToEdit(undefined);
          }}
        />

       
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.venturus.org.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Venturus
        </a>
      </footer>
    </div>
  );
};

export default Home;