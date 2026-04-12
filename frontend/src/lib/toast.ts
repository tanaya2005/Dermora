import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#16A085',
        color: '#fff',
        borderRadius: '16px',
        fontFamily: 'DM Sans, sans-serif'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#16A085'
      }
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#E94560',
        color: '#fff',
        borderRadius: '16px',
        fontFamily: 'DM Sans, sans-serif'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#E94560'
      }
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#1A1A2E',
        color: '#F5F0EB',
        borderRadius: '16px',
        fontFamily: 'DM Sans, sans-serif'
      }
    });
  },
  
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  }
};