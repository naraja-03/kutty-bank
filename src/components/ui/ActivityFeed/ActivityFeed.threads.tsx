'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetTransactionsQuery, useCreateTransactionMutation } from '../../../store/api/transactionApi';
import { ArrowDown, Send } from 'lucide-react';
import { clsx } from 'clsx';
import { RootState } from '../../../store';

interface ActivityFeedProps {
  className?: string;
}


const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export default function ActivityFeed({ className }: ActivityFeedProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: 'Food',
    type: 'expense' as 'income' | 'expense',
    note: ''
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  

  const { user } = useSelector((state: RootState) => state.auth);
  
  const { data: transactionData, isLoading, refetch } = useGetTransactionsQuery({ 
    limit: 50, 
    offset: 0 
  });
  
  const [createTransaction] = useCreateTransactionMutation();


  const transactions = useMemo(() => {
    const txns = transactionData?.transactions || [];

    return [...txns].reverse();
  }, [transactionData]);

  useEffect(() => {

    if (transactions && transactions.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [transactions]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.amount || !user) return;

    try {
      await createTransaction({
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        type: newTransaction.type,
        userId: user.id,
        familyId: user.familyId,
        note: newTransaction.note,
        date: new Date().toISOString(),
      }).unwrap();


      setNewTransaction({
        amount: '',
        category: 'Food',
        type: 'expense',
        note: ''
      });


      setTimeout(() => {
        scrollToBottom();
      }, 100);

      refetch();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const categories = [
    'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 
    'Healthcare', 'Education', 'Groceries', 'Salary', 'Other'
  ];

  return (
    <div className={clsx('flex flex-col h-screen bg-black', className)}>
      
      <header className="bg-black border-b border-gray-800 px-4 py-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-white">Family Budget</h1>
        </div>
      </header>

      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                  <div className="h-16 bg-gray-800 rounded-2xl w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        
        {!isLoading && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Start the Conversation</h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              Share your first transaction with the family. Every expense and income will appear here like a chat!
            </p>
            <div className="text-sm text-gray-500">
              Use the form below to add your first transaction
            </div>
          </div>
        )}

        
        {!isLoading && transactions.length > 0 && transactions.map((transaction, index) => {
          const isCurrentUser = transaction.userId === user?.id;
          
          return (
            <div 
              key={transaction.id} 
              className={clsx(
                'flex space-x-3 animate-in slide-in-from-bottom-4 duration-300',
                isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-white">
                    {getInitials(transaction.userName || 'U')}
                  </span>
                </div>
              )}

              
              <div className={clsx(
                'max-w-xs px-4 py-3 rounded-2xl',
                isCurrentUser 
                  ? 'bg-blue-600 text-white ml-12' 
                  : 'bg-gray-800 text-white mr-12'
              )}>
                
                {!isCurrentUser && (
                  <div className="text-xs text-gray-400 mb-1">
                    {transaction.userName || 'Unknown'}
                  </div>
                )}

                
                <div className="space-y-2">
                  
                  <div className="flex flex-col space-y-1">
                    <span className={clsx(
                      'text-lg font-bold',
                      transaction.type === 'income' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    )}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                    <span className="text-xs text-gray-300">
                      {transaction.category}
                    </span>
                  </div>

                  
                  {transaction.note && (
                    <p className="text-sm text-gray-100">
                      {transaction.note}
                    </p>
                  )}

                  
                  <div className="text-xs text-gray-400">
                    {formatTime(transaction.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        
        <div ref={bottomRef} className="h-1" />
      </div>

      
      <div className="bg-black border-t border-gray-800 p-4">
        <div className="space-y-3">
          
          <div className="flex space-x-2 mb-3">
            <button
              onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
              className={clsx(
                'px-3 py-1 rounded-full text-xs',
                newTransaction.type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              )}
            >
              Expense
            </button>
            <button
              onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
              className={clsx(
                'px-3 py-1 rounded-full text-xs',
                newTransaction.type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              )}
            >
              Income
            </button>
            
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction(prev => ({ 
                ...prev, 
                category: e.target.value 
              }))}
              className="px-3 py-1 bg-gray-800 text-white rounded-full text-xs border border-gray-700"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          
          <div className="flex items-center space-x-3">
            
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-white">
                {user ? getInitials(user.name) : 'U'}
              </span>
            </div>

            
            <input
              type="number"
              placeholder="0"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ 
                ...prev, 
                amount: e.target.value 
              }))}
              className="w-20 px-3 py-2 bg-gray-900/95 text-white rounded-2xl text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            
            
            <input
              type="text"
              placeholder="Add a note..."
              value={newTransaction.note}
              onChange={(e) => setNewTransaction(prev => ({ 
                ...prev, 
                note: e.target.value 
              }))}
              className="flex-1 px-4 py-2 bg-gray-900/95 text-white rounded-2xl text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTransaction.amount) {
                  handleAddTransaction();
                }
              }}
            />
            
            
            <button
              onClick={handleAddTransaction}
              disabled={!newTransaction.amount}
              className={clsx(
                'p-2 rounded-full transition-colors',
                newTransaction.amount
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              )}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-32 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}
