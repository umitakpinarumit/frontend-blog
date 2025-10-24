'use client';

import { useEffect, useState } from 'react';

/**
 * DarkModeTest Component
 * Dark mode'un çalışıp çalışmadığını test etmek için
 * Ana sayfada geçici olarak kullanılacak
 */

export default function DarkModeTest() {
  const [htmlClass, setHtmlClass] = useState('');

  useEffect(() => {
    // HTML class'ını sürekli kontrol et
    const checkClass = () => {
      setHtmlClass(document.documentElement.className);
    };
    
    checkClass();
    const interval = setInterval(checkClass, 500);
    
    return () => clearInterval(interval);
  }, []);

  const testToggle = () => {
    console.log('🧪 TEST: Toggle çalıştırılıyor');
    const hasDark = document.documentElement.classList.contains('dark');
    
    if (hasDark) {
      document.documentElement.classList.remove('dark');
      console.log('🧪 TEST: dark class KALDIRILDI');
    } else {
      document.documentElement.classList.add('dark');
      console.log('🧪 TEST: dark class EKLENDİ');
    }
    
    console.log('🧪 TEST: Yeni class:', document.documentElement.className);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-4 shadow-xl">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
          🧪 Dark Mode Test
        </h3>
        
        <div className="text-xs space-y-1 mb-3 text-gray-700 dark:text-gray-300">
          <div>HTML Class: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
            {htmlClass || '(boş)'}
          </code></div>
          <div className="mt-2">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
            <span className="text-xs">☝️ Bu kutu dark mode'da koyu olmalı</span>
          </div>
        </div>

        <button
          onClick={testToggle}
          className="w-full px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
        >
          Test Toggle
        </button>
      </div>
    </div>
  );
}

