import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mockCustomerConsentStats,
    mockMemberArchivingStats,
    mockMemberArchivingList,
    mockGroupConsentStats,
    mockGroupConsentList,
} from '@/lib/mockData';

export default function ArchivingStats() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('member');

    const RADIAN = Math.PI / 180;

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header with gradient accent */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                <h1 className="text-2xl font-bold">存档情况统计</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-xs gap-1 border-dashed text-muted-foreground hover:text-primary hover:border-primary"
                        >
                            <HelpCircle className="h-3.5 w-3.5" />
                            逻辑说明
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                存档情况统计页面 - 逻辑说明
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="space-y-6 text-sm">
                                {/* 页面概述 */}
                                <section>
                                    <h3 className="font-semibold text-base mb-2 text-foreground">📋 页面概述</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        存档情况统计页面用于展示企业微信会话存档的整体情况，包括单聊客户同意情况、客户群内客户同意情况、以及成员的存档开启情况统计。由于单聊和群聊的会话存档同意状态是独立的，因此分别展示。
                                    </p>
                                </section>

                                {/* 图表说明 */}
                                <section>
                                    <h3 className="font-semibold text-base mb-3 text-foreground">📊 图表说明</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">客户同意情况统计图（单聊）</div>
                                            <div className="text-muted-foreground mt-1">展示所有单聊客户对会话存档的同意状态分布，包括"已同意"和"未同意"两种状态的占比。</div>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">客户同意情况统计图（客户群）</div>
                                            <div className="text-muted-foreground mt-1">展示客户群内外部联系人对会话存档的同意状态分布。企业成员固定同意，此处仅统计外部联系人。</div>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">成员存档开启情况统计图</div>
                                            <div className="text-muted-foreground mt-1">展示配置了客户联系功能的成员的存档开启状态分布，包括"办公版"、"服务版"、"企业版"和"未开启"四种状态。</div>
                                        </div>
                                    </div>
                                </section>

                                {/* 明细表说明 */}
                                <section>
                                    <h3 className="font-semibold text-base mb-3 text-foreground">📝 明细表说明</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">按成员查看</div>
                                            <div className="text-muted-foreground mt-1">展示每个成员的存档开启情况及其名下单聊客户的同意情况。</div>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">按群查看</div>
                                            <div className="text-muted-foreground mt-1">展示每个客户群内外部联系人的同意情况。企业成员固定同意，仅统计外部联系人总数和已同意人数。</div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="font-semibold text-base mb-2 text-foreground">📅 数据时效性</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>饼图与明细列表均展示**当前最新**的同意/开启状态，不随全局时间筛选变化。</li>
                                        <li>如需查看状态变更的历史轨迹，请进入"查看详情"在明细页进行时间筛选。</li>
                                    </ul>
                                </section>

                                {/* 交互说明 */}
                                <section>
                                    <h3 className="font-semibold text-base mb-2 text-foreground">🖱️ 交互说明</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>饼图：支持鼠标悬停查看具体数值和占比</li>
                                        <li>Tab切换：可在"按成员"和"按群"之间切换查看明细</li>
                                        <li>查看详情：点击跳转至对应的详情页面</li>
                                        <li>分页导航：支持翻页查看更多数据</li>
                                    </ul>
                                </section>

                                {/* 开发注意事项 */}
                                <section>
                                    <h3 className="font-semibold text-base mb-2 text-foreground">⚠️ 开发注意事项</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>当前使用 Mock 数据，后续需对接真实 API</li>
                                        <li>统计成员范围仅限配置了客户联系功能的成员</li>
                                        <li>需处理数据加载状态和错误状态</li>
                                    </ul>
                                </section>
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>



            {/* Charts - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Customer Consent Chart (Single Chat) */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-center font-semibold mb-4">会话存档同意情况（单聊客户）</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockCustomerConsentStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
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
                                    outerRadius={70}
                                    innerRadius={40}
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

                {/* Group Consent Chart */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-center font-semibold mb-1">会话存档同意情况（客户群）</h3>
                    <p className="text-center text-xs text-muted-foreground mb-4">*仅统计外部联系人</p>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockGroupConsentStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
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
                                    outerRadius={70}
                                    innerRadius={40}
                                    fill="#8884d8"
                                    dataKey="value"
                                    strokeWidth={2}
                                    stroke="hsl(var(--background))"
                                >
                                    {mockGroupConsentStats.map((entry, index) => (
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
                    <h3 className="text-center font-semibold mb-1 relative">会话存档开启情况（成员）</h3>
                    <p className="text-center text-xs text-muted-foreground mb-4 relative">*配置了客户联系功能的成员</p>
                    <div className="h-[280px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockMemberArchivingStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
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
                                    outerRadius={70}
                                    innerRadius={40}
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

            {/* Detail Table with Tabs */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h3 className="text-lg font-semibold">会话存档同意/开启情况明细</h3>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="member">按成员</TabsTrigger>
                        <TabsTrigger value="group">按群</TabsTrigger>
                    </TabsList>

                    {/* Member Tab */}
                    <TabsContent value="member">
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
                    </TabsContent>

                    {/* Group Tab */}
                    <TabsContent value="group">
                        <div className="rounded-lg border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">群名称</TableHead>
                                        <TableHead className="font-semibold">群主</TableHead>
                                        <TableHead className="font-semibold">外部联系人同意情况（已同意/总数）</TableHead>
                                        <TableHead className="font-semibold">操作</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockGroupConsentList.map((group) => (
                                        <TableRow key={group.groupId} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">{group.groupName}</TableCell>
                                            <TableCell>{group.owner}</TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">{group.agreedCount}/{group.externalMemberCount}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                                    onClick={() => navigate(`/archiving/group-details?groupId=${group.groupId}`)}
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
                                共 <span className="font-medium text-foreground">{mockGroupConsentList.length}</span> 条记录
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
