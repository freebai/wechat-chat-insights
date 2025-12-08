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
            {/* Header with gradient accent */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                <h1 className="text-2xl font-bold">存档情况统计</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
                <Button className="shadow-sm">查询</Button>
                <Button variant="outline">重置</Button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Customer Consent Chart */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-center font-semibold mb-4">会话存档同意情况统计图（客户）</h3>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockCustomerConsentStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
                                        const radius = outerRadius * 1.25;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                                                {`${name}:`}
                                                <tspan x={x} dy="1.2em" textAnchor={x > cx ? 'start' : 'end'} className="text-muted-foreground">{`${(percent * 100).toFixed(1)}% (${value}人)`}</tspan>
                                            </text>
                                        );
                                    }}
                                    outerRadius={90}
                                    innerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                    strokeWidth={2}
                                    stroke="hsl(var(--background))"
                                >
                                    {mockCustomerConsentStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Member Archiving Chart */}
                <div className="bg-card border rounded-xl p-6 shadow-sm relative overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }} />
                    <h3 className="text-center font-semibold mb-1 relative">会话存档开启情况统计图（成员）</h3>
                    <p className="text-center text-xs text-muted-foreground mb-4 relative">*统计成员范围为配置了客户联系功能的成员</p>
                    <div className="h-[320px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockMemberArchivingStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
                                        const radius = outerRadius * 1.25;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                                                {`${name}:`}
                                                <tspan x={x} dy="1.2em" textAnchor={x > cx ? 'start' : 'end'} className="text-muted-foreground">{`${(percent * 100).toFixed(1)}% (${value}人)`}</tspan>
                                            </text>
                                        );
                                    }}
                                    outerRadius={90}
                                    innerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                    strokeWidth={3}
                                    stroke="hsl(var(--card))"
                                >
                                    {mockMemberArchivingStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detail Table */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h3 className="text-lg font-semibold">会话存档同意/开启情况明细</h3>
                </div>
                <div className="rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">成员</TableHead>
                                <TableHead className="font-semibold">存档开启情况</TableHead>
                                <TableHead className="font-semibold">客户同意情况（已同意/客户总数）</TableHead>
                                <TableHead className="font-semibold">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockMemberArchivingList.map((member) => (
                                <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>
                                        {member.archivingType === 'office' && <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-medium">办公版</span>}
                                        {member.archivingType === 'service' && <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium">服务版</span>}
                                        {member.archivingType === 'enterprise' && <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-medium">企业版</span>}
                                        {member.archivingType === 'none' && <span className="text-muted-foreground bg-muted px-2.5 py-1 rounded-full text-xs font-medium">未开启</span>}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">{member.agreedCount}/{member.customerCount}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary hover:bg-primary/10"
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

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                        共 <span className="font-medium text-foreground">{mockMemberArchivingList.length}</span> 条记录
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled className="rounded-lg">
                            上一页
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                            1
                        </Button>
                        <Button variant="outline" size="sm" disabled className="rounded-lg">
                            下一页
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
