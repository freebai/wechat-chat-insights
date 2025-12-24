import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
import { mockGroupMemberConsentList, mockGroupConsentList } from '@/lib/mockData';

export default function GroupConsentDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialGroupId = searchParams.get('groupId') || 'all';

    const [groupId, setGroupId] = useState<string>(initialGroupId);
    const [status, setStatus] = useState<string>('all');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const filteredData = useMemo(() => {
        return mockGroupMemberConsentList.filter((item) => {
            const matchGroup = groupId === 'all' || item.groupId === groupId;
            const matchStatus = status === 'all' || item.status === status;

            // 时间筛选
            let matchDate = true;
            if (dateRange && item.changeTime) {
                const itemDate = new Date(item.changeTime);
                const fromDate = new Date(dateRange.from);
                const toDate = new Date(dateRange.to);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);
                matchDate = itemDate >= fromDate && itemDate <= toDate;
            }
            // 如果筛选了时间但数据没有变更时间，则不符合筛选条件
            else if (dateRange && !item.changeTime) {
                matchDate = false;
            }

            return matchGroup && matchStatus && matchDate;
        });
    }, [groupId, status, dateRange]);

    const handleReset = () => {
        setGroupId('all');
        setStatus('all');
        setDateRange(undefined);
    };

    // 获取当前选中群的名称
    const currentGroupName = useMemo(() => {
        if (groupId === 'all') return null;
        const group = mockGroupConsentList.find(g => g.groupId === groupId);
        return group?.groupName || null;
    }, [groupId]);

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {currentGroupName ? `${currentGroupName} - 成员同意情况` : '群成员同意情况明细'}
                </h1>
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
                                群成员同意明细页面 - 逻辑说明
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="space-y-6 text-sm">
                                <section>
                                    <h3 className="font-semibold text-base mb-2 text-foreground">📋 页面概述</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        本页面展示客户群内外部联系人对企业微信会话存档的同意情况明细。企业成员固定同意会话存档，因此本页面仅展示外部联系人的同意状态。
                                    </p>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-base mb-3 text-foreground">📊 字段定义</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">成员名称</div>
                                            <div className="text-muted-foreground mt-1">群内外部联系人的名称。</div>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">同意状态</div>
                                            <div className="text-muted-foreground mt-1">
                                                <strong>已同意</strong>：外部联系人已点击确认同意会话存档。<br />
                                                <strong>未同意</strong>：外部联系人尚未操作或明确拒绝。
                                            </div>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <div className="font-medium text-foreground">变更时间</div>
                                            <div className="text-muted-foreground mt-1">外部联系人最后一次操作或更新同意状态的时间。</div>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-base mb-2 text-foreground">🔍 筛选逻辑</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li><strong>时间筛选</strong>：作用于"变更时间"。若成员从未操作（无变更时间），则不会出现在特定时间范围的筛选结果中。</li>
                                        <li><strong>全量查看</strong>：默认时间筛选项为"全部"，展示所有历史记录。</li>
                                    </ul>
                                </section>
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-card p-4 rounded-lg border">
                <div className="w-[200px]">
                    <Select value={groupId} onValueChange={setGroupId}>
                        <SelectTrigger>
                            <SelectValue placeholder="选择群" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部群</SelectItem>
                            {mockGroupConsentList.map((group) => (
                                <SelectItem key={group.groupId} value={group.groupId}>
                                    {group.groupName}
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

                <DateRangeFilter value={dateRange} onChange={setDateRange} showAll={true} />

                <Button onClick={handleReset} variant="outline">
                    重置
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>成员名称</TableHead>
                            <TableHead>所属群</TableHead>
                            <TableHead>同意状态</TableHead>
                            <TableHead>变更时间</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.memberName}</TableCell>
                                    <TableCell>{item.groupName}</TableCell>
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
