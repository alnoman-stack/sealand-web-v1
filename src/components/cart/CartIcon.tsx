const CartIcon = ({ count, onClick }: { count: number; onClick: () => void }) => {
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button 
        onClick={onClick} 
        className="bg-green-700 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full border-2 border-white animate-bounce">
            {count}
          </span>
        )}
      </button>
    </div>
  );
};

export default CartIcon;