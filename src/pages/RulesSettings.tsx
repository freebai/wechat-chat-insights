import { useState } from 'react';
import { Save, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { defaultThresholds, ScoreThresholds, defaultGroupScoringConfig, GroupScoringConfig, mockChatGroups } from '@/lib/mockData';
import { InfoTooltip } from '@/components/common/InfoTooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GroupSelectDialog } from '@/components/GroupSelectDialog';

export default function RulesSettings() {
  const { toast } = useToast();

  // 阈值配置状态
  const [thresholds, setThresholds] = useState<ScoreThresholds>(defaultThresholds);

  // 群分析参与配置
  const [scoringConfig, setScoringConfig] = useState<GroupScoringConfig>(defaultGroupScoringConfig);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 获取已选群聊的名称列表
  const selectedGroupNames = scoringConfig.groupIds
    .map(id => mockChatGroups.find(g => g.id === id)?.name)
    .filter(Boolean);

  const handleSave = () => {
    toast({
      title: '配置已保存',
      description: '分析规则配置已更新，将在下次分析时生效',
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">规则配置</h1>
          <p className="text-muted-foreground mt-1">自定义群聊分析规则和参与配置</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          保存配置
        </Button>
      </div>

      <div className="space-y-8">
        {/* Group Analysis Config */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            群分析参与配置
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            配置哪些群聊参与分析
          </p>

          <RadioGroup
            value={scoringConfig.mode === 'all' ? 'all' : 'custom'}
            onValueChange={(value) => {
              if (value === 'all') {
                setScoringConfig({ mode: 'all', groupIds: [] });
              } else {
                setScoringConfig(prev => ({ ...prev, mode: 'include' }));
              }
            }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="all" id="scoring-all" />
              <Label htmlFor="scoring-all" className="cursor-pointer">
                全部群聊参与分析
              </Label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="custom" id="scoring-custom" />
                <Label htmlFor="scoring-custom" className="cursor-pointer">
                  自定义
                </Label>
              </div>

              {scoringConfig.mode !== 'all' && (
                <div className="ml-7 space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  {/* 自定义模式子选项 */}
                  <RadioGroup
                    value={scoringConfig.mode}
                    onValueChange={(value: 'include' | 'exclude') => {
                      setScoringConfig(prev => ({ ...prev, mode: value }));
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="include" id="mode-include" />
                      <Label htmlFor="mode-include" className="cursor-pointer text-sm">
                        仅以下群参与分析
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="exclude" id="mode-exclude" />
                      <Label htmlFor="mode-exclude" className="cursor-pointer text-sm">
                        以下群不参与AI分析
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* 选择群聊按钮 */}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogOpen(true)}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      选择群聊
                      {scoringConfig.groupIds.length > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                          {scoringConfig.groupIds.length}
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* 已选群聊展示 */}
                  {selectedGroupNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedGroupNames.map((name, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-muted rounded border border-border"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </RadioGroup>

          {/* 分析参与门槛 */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              分析参与门槛
              <InfoTooltip content="群聊需满足以下条件才会被纳入分析" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  最少消息数要求
                  <InfoTooltip content="群内消息数少于此值时，认为数据不足，暂不生成分析结果。" />
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={thresholds.coldStartMessageThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, coldStartMessageThreshold: Number(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">条</span>
                </div>
                <p className="text-xs text-muted-foreground">当前：消息 &lt; {thresholds.coldStartMessageThreshold} 条的群暂不分析</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  最少成员数要求
                  <InfoTooltip content="成员数少于此值的群为微型群，分析仅供参考。" />
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={thresholds.microGroupMemberThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, microGroupMemberThreshold: Number(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">人</span>
                </div>
                <p className="text-xs text-muted-foreground">当前：成员 &lt; {thresholds.microGroupMemberThreshold} 人的群分析仅供参考</p>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              不参与AI分析的群聊仍会正常统计基础指标，仅不生成AI分析报告。
            </p>
          </div>
        </div>
      </div>

      {/* 群选择弹窗 */}
      <GroupSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedIds={scoringConfig.groupIds}
        onConfirm={(ids) => setScoringConfig(prev => ({ ...prev, groupIds: ids }))}
        title={scoringConfig.mode === 'include' ? '选择参与AI分析的群聊' : '选择不参与AI分析的群聊'}
      />
    </div>
  );
}
