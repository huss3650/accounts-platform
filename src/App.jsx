import React, { useState, useEffect } from 'react';
import { User, Settings, Trash2, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
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
  const [showLogin, setShowLogin] = useState(false);
  const { currentUser, logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
      showAlert('تم تسجيل الخروج بنجاح', 'success');
    } catch (error) {
      showAlert('حدث خطأ أثناء تسجيل الخروج', 'error');
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    try {
      await addAccount(newAccount);
      showAlert('تم إضافة الحساب بنجاح', 'success');
      loadAccounts();
      setNewAccount({
        username: '',
        platform: 'Instagram',
        type: 'ثلاثي',
        status: 'متاح'
      });
    } catch (error) {
      showAlert('حدث خطأ أثناء إضافة الحساب', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">منصة الحسابات المميزة</h1>
          <p className="text-muted-foreground">
            اكتشف مجموعة متنوعة من الحسابات المميزة على مختلف منصات التواصل الاجتماعي
          </p>
        </header>

        {alert.show && (
          <Alert className="mb-4" variant={alert.type}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="search-bar">
          <Input
            type="text"
            placeholder="ابحث عن حساب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`filter-button ${selectedPlatform === platform ? 'active' : ''}`}
            >
              {platform}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`filter-button ${selectedType === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="account-grid">
          {accounts
            .filter(
              (account) =>
                (selectedPlatform === 'الكل' || account.platform === selectedPlatform) &&
                (selectedType === 'الكل' || account.type === selectedType) &&
                account.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((account) => (
              <Card key={account.id} className="account-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`status-badge ${account.status === 'متاح' ? 'status-available' : 'status-sold'}`}>
                      {account.status}
                    </span>
                    <span className="platform-badge bg-blue-100 text-blue-800">
                      {account.platform}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{account.username}</h3>
                  <p className="text-muted-foreground">{account.type}</p>
                  {currentUser && (
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAccountStatus(account.id, account.status === 'متاح' ? 'تم البيع' : 'متاح')}
                      >
                        تغيير الحالة
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAccount(account.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="admin-controls">
          {currentUser ? (
            <>
              <Button variant="outline" onClick={handleLogout}>
                تسجيل الخروج
              </Button>
              <Button onClick={() => document.getElementById('addAccountForm').classList.toggle('hidden')}>
                إضافة حساب
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowLogin(true)}>
              <User className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </Button>
          )}
        </div>

        {showLogin && <LoginPage onCancel={() => setShowLogin(false)} />}

        <div id="addAccountForm" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>إضافة حساب جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAccount} className="space-y-4">
                <Input
                  placeholder="اسم المستخدم"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                  className="text-right"
                  required
                />
                <select
                  value={newAccount.platform}
                  onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                  className="w-full p-2 border rounded text-right"
                  required
                >
                  {platforms.filter(p => p !== 'الكل').map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  className="w-full p-2 border rounded text-right"
                  required
                >
                  {types.filter(t => t !== 'الكل').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <Button type="submit">إضافة</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('addAccountForm').classList.add('hidden')}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
