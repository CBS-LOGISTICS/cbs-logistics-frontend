import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import * as React from "react"

// Primitives
const TableRoot = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
))
TableRoot.displayName = "TableRoot"

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
))
TableCaption.displayName = "TableCaption"

// High-level Table Component
export interface Column<T> {
    title: React.ReactNode;
    dataIndex?: keyof T;
    key: string;
    render?: (value: any, record: T, index: number) => React.ReactNode;
    className?: string;
    width?: string | number;
}

export interface TableProps<T> {
    columns: Column<T>[];
    dataSource: T[];
    loading?: boolean;
    rowKey?: string | ((record: T) => string);
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    className?: string;
    emptyText?: React.ReactNode;
}

function Table<T>({
    columns,
    dataSource,
    loading,
    rowKey = "_id", // Default to _id for MongoDB
    onRow,
    className,
    emptyText = "No data found",
}: TableProps<T>) {
    return (
        <div className={cn("rounded-md border", className)}>
            <TableRoot>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key} className={col.className} style={{ width: col.width }}>
                                {col.title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex justify-center items-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : dataSource.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                {emptyText}
                            </TableCell>
                        </TableRow>
                    ) : (
                        dataSource.map((record, index) => {
                            const key = typeof rowKey === 'function' ? rowKey(record) : (record as any)[rowKey] || index;
                            const rowProps = onRow ? onRow(record, index) : {};

                            return (
                                <TableRow key={key} {...rowProps}>
                                    {columns.map((col) => {
                                        const value = col.dataIndex ? (record as any)[col.dataIndex] : undefined;
                                        return (
                                            <TableCell key={col.key} className={col.className}>
                                                {col.render ? col.render(value, record, index) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </TableRoot>
        </div>
    );
}

export {
    Table, // Exported for custom usage if needed
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader, TableRoot, TableRow
}

