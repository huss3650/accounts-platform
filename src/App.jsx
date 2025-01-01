import React, { useState, useEffect } from 'react';
import { User, Settings, Trash2, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { useAuth } from './contexts/AuthContext';
import { 
  getAccounts, 
  addAccount, 
  deleteAccount, 
  updateAccountStatus,
  searchAccounts
} from './services/accountService';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('الكل');
  const [selectedType, setSelectedType] = useState('الكل');
  const { currentUser, login, logout } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const platforms = ['الكل', 'Instagram', 'X', 'Snapchat', 'TikTok'];
  const types = ['الكل', 'ثلاثي', 'رباعي', 'مميز'];

  const [newAccount, setNewAccount] = useState({
    username: '',
    platform: 'Instagram',
    type: 'ثلاثي',
    status: 'متاح'
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      showAlert('حدث خطأ أثناء تحميل الحسابات', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    try {
      setLoading(true);
      const results = await searchAccounts(selectedPlatform, selectedType, searchTerm);
      setAccounts(results);
    } catch (error) {
      showAlert('حدث خطأ أثناء البحث', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAccount(e) {
    e.preventDefault();
    if (!newAccount.username) {
      showAlert('اسم المستخدم مطلوب', 'error');
      return;
    }

    try {
      const addedAccount = await addAccount(newAccount);
      setAccounts(prev => [addedAccount, ...prev]);
      setNewAccount({
        username: '',
        platform: 'Instagram',
        type: 'ثلاثي',
        status: 'متاح'
      });
      showAlert('تم إضافة الحساب بنجاح', 'success');
    } catch (error) {
      showAlert('حدث خطأ أثناء إضافة الحساب', 'error');
    }
  }

  async function handleDeleteAccount(id) {
    try {
      await deleteAccount(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
      showAlert('تم حذف الحساب بنجاح', 'success');
    } catch (error) {
      showAlert('حدث خطأ أثناء حذف الحساب', 'error');
    }
  }

  async function handleStatusChange(id) {
    const account = accounts.find(acc => acc.id === id);
    const newStatus = account.status === 'متاح' ? 'مباع' : 'متاح';
    
    try {
      await updateAccountStatus(id, newStatus);
      setAccounts(prev => prev.map(acc => 
        acc.id === id ? { ...acc, status: newStatus } : acc
      ));
      showAlert('تم تحديث حالة الحساب بنجاح', 'success');
    } catch (error) {
      showAlert('حدث خطأ أثناء تحديث حالة الحساب', 'error');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      showAlert('تم تسجيل الدخول بنجاح', 'success');
    } catch (error) {
      showAlert('خطأ في اسم المستخدم أو كلمة المرور', 'error');
    }
  }

  async function handleLogout() {
    try {
      await logout();
      showAlert('تم تسجيل الخروج بنجاح', 'success');
    } catch (error) {
      showAlert('حدث خطأ أثناء تسجيل الخروج', 'error');
    }
  }

  function showAlert(message, type) {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">منصة الحسابات المميزة</h1>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="ml-2" />
                تسجيل خروج
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setIsAdmin(true)}>
                <Settings className="ml-2" />
                الإدارة
              </Button>
            )}
          </div>
        </div>
      </nav>

      {currentUser && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-center">تسجيل الدخول للإدارة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="text-right"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="كلمة المرور"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full">دخول</Button>
                  <Button type="button" onClick={() => setIsAdmin(false)} variant="outline" className="w-full">إلغاء</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {alert.show && (
          <Alert className={`mb-4 ${alert.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">استكشف الحسابات المميزة</h1>
          <p className="text-gray-600">اكتشف مجموعة متنوعة من الحسابات المميزة على مختلف منصات التواصل الاجتماعي</p>
        </div>

        {currentUser && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                إضافة حساب جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAccount} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="اسم المستخدم"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                  className="text-right"
                />
                <select
                  value={newAccount.platform}
                  onChange={(e) => setNewAccount({...newAccount, platform: e.target.value})}
                  className="p-2 border rounded-lg text-right"
                >
                  {platforms.slice(1).map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                  className="p-2 border rounded-lg text-right"
                >
                  <option value="ثلاثي">ثلاثي</option>
                  <option value="رباعي">رباعي</option>
                  <option value="مميز">مميز</option>
                </select>
                <select
                  value={newAccount.status}
                  onChange={(e) => setNewAccount({...newAccount, status: e.target.value})}
                  className="p-2 border rounded-lg text-right"
                >
                  <option value="متاح">متاح</option>
                  <option value="مباع">مباع</option>
                </select>
                <Button type="submit" className="w-full md:col-span-2">إضافة الحساب</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4 mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث عن حساب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">نوع الحساب</label>
              <div className="flex gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedType === type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">المنصة</label>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedPlatform === platform 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accounts.map((account) => (
            <Card 
              key={account.id} 
              className={`hover:shadow-lg transition-shadow ${
                account.status === 'مباع' ? 'bg-red-50' : 'bg-gradient-to-br from-white to-gray-50'
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-bold">{account.username}</span>
                  </div>
                  {currentUser && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(account.id)}
                        className="hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-600">المنصة:</span>
                    <span className="font-medium">{account.platform}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium">{account.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الحالة:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      account.status === 'متاح' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
