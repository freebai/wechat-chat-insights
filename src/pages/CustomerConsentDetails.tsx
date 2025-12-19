import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DateRangeFilter, DateRange } from '@/components/common/DateRangeFilter';
import { mockCustomerConsentList, mockMemberArchivingList } from '@/lib/mockData';

export default function CustomerConsentDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialEmployeeId = searchParams.get('employeeId') || 'all';

    const [employeeId, setEmployeeId] = useState<string>(initialEmployeeId);
    const [status, setStatus] = useState<string>('all');
    const [dateRange, setDateRange] = useState<DateRange>(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 30); // 默认近30天
        return { from, to };
    });

    const filteredData = useMemo(() => {
        return mockCustomerConsentList.filter((item) => {
            const matchEmployee = employeeId === 'all' || item.employeeId === employeeId;
            const matchStatus = status === 'all' || item.status === status;

            // 时间筛选
            let matchDate = true;
            if (item.changeTime) {
                const itemDate = new Date(item.changeTime);
                const fromDate = new Date(dateRange.from);
                const toDate = new Date(dateRange.to);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);
                matchDate = itemDate >= fromDate && itemDate <= toDate;
            }

            return matchEmployee && matchStatus && matchDate;
        });
    }, [employeeId, status, dateRange]);

    const handleReset = () => {
        setEmployeeId('all');
        setStatus('all');
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 30);
        setDateRange({ from, to });
    };

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">客户同意情况明细</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-card p-4 rounded-lg border">
                <div className="w-[200px]">
                    <Select value={employeeId} onValueChange={setEmployeeId}>
                        <SelectTrigger>
                            <SelectValue placeholder="所属员工" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部员工</SelectItem>
                            {mockMemberArchivingList.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[200px]">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="同意状态" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部状态</SelectItem>
                            <SelectItem value="agreed">已同意</SelectItem>
                            <SelectItem value="disagreed">未同意</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DateRangeFilter value={dateRange} onChange={setDateRange} />

                <Button onClick={handleReset} variant="outline">
                    重置
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>客户名称</TableHead>
                            <TableHead>所属员工</TableHead>
                            <TableHead>同意状态</TableHead>
                            <TableHead>变更时间</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.employeeName}</TableCell>
                                    <TableCell>
                                        {item.status === 'agreed' ? (
                                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">已同意</span>
                                        ) : (
                                            <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs">未同意</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.changeTime || '-'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    暂无数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination (Mock UI) */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    共 {filteredData.length} 条
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        上一页
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        下一页
                    </Button>
                </div>
            </div>
        </div>
    );
}
