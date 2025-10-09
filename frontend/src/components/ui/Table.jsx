import { cn } from '@/utils/helpers';

const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={cn('bg-slate-50 border-b border-slate-200', className)} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={cn('divide-y divide-slate-200', className)} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, ...props }) => {
  return (
    <tr className={cn('hover:bg-slate-50 transition-colors', className)} {...props}>
      {children}
    </tr>
  );
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-slate-900', className)} {...props}>
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
