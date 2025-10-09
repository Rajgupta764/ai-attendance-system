import { cn } from '@/utils/helpers';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn('text-xl font-bold text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
