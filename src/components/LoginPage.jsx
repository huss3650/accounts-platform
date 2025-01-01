import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function LoginPage({ onCancel }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(loginData.email, loginData.password);
    } catch (err) {
      setError('خطأ في البريد الإلكتروني أو كلمة المرور');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">تسجيل الدخول للإدارة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-right">
                {error}
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="text-right"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="text-right"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="w-full">دخول</Button>
              <Button type="button" onClick={onCancel} variant="outline" className="w-full">إلغاء</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
