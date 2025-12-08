import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import { mockCustomerConsentStats, mockMemberArchivingStats, mockMemberArchivingList } from '@/lib/mockData';

export default function ArchivingStats() {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(2022, 7, 9),
        to: new Date(2022, 7, 15),
    });

    const RADIAN = Math.PI / 180;

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <h1 className="text-2xl font-bold">存档情况统计</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-card p-4 rounded-lg border">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
                <Button>查询</Button>
                <Button variant="outline">重置</Button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Customer Consent Chart */}
                <div className="h-[400px] w-full">
                    <h3 className="text-center font-medium mb-4">会话存档同意情况统计图（客户）</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={mockCustomerConsentStats}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
                                    const radius = outerRadius * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                            {`${name}:`}
                                            <tspan x={x} dy="1.2em" textAnchor={x > cx ? 'start' : 'end'}>{`${(percent * 100).toFixed(2)}%, 共 (${value}) 人`}</tspan>
                                        </text>
                                    );
                                }}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {mockCustomerConsentStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Archiving Chart */}
                <div className="h-[400px] w-full">
                    <h3 className="text-center font-medium mb-1">会话存档开启情况统计图（成员）</h3>
                    <p className="text-center text-xs text-muted-foreground mb-4">*统计成员范围为配置了客户联系功能的成员</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={mockMemberArchivingStats}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
                                    const radius = outerRadius * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                            {`${name}:`}
                                            <tspan x={x} dy="1.2em" textAnchor={x > cx ? 'start' : 'end'}>{`${(percent * 100).toFixed(2)}%, 共 (${value}) 人`}</tspan>
                                        </text>
                                    );
                                }}
                                outerRadius={100}
                                innerRadius={0}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {mockMemberArchivingStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detail Table */}
            <div>
                <h3 className="text-lg font-semibold mb-4">会话存档同意/开启情况明细</h3>
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>成员</TableHead>
                                <TableHead>存档开启情况</TableHead>
                                <TableHead>客户同意情况</TableHead>
                                <TableHead>操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockMemberArchivingList.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>
                                        {member.archivingType === 'office' && <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">办公版</span>}
                                        {member.archivingType === 'service' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">服务版</span>}
                                        {member.archivingType === 'enterprise' && <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs">企业版</span>}
                                        {member.archivingType === 'none' && <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs">未开启</span>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span>已同意：{member.agreedCount}</span>
                                            <span className="text-muted-foreground">/</span>
                                            <span>客户总数：{member.customerCount}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="link"
                                            className="text-primary p-0 h-auto"
                                            onClick={() => navigate(`/archiving/customer-details?employeeId=${member.id}`)}
                                        >
                                            查看详情
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination (Mock UI) */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        共 {mockMemberArchivingList.length} 条
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
        </div>
    );
}
