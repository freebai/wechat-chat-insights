import { useState } from 'react';
import { Save, Settings2, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { scoreDimensions, defaultThresholds, ScoreThresholds } from '@/lib/mockData';
import { InfoTooltip } from '@/components/common/InfoTooltip';

export default function RulesSettings() {
  const { toast } = useToast();

  // 阈值配置状态
  const [thresholds, setThresholds] = useState<ScoreThresholds>(defaultThresholds);

  // 权重配置 - 基于六维模型
  const [weights, setWeights] = useState({
    // 统计类 (60%)
    speakerPenetration: 21,      // 35% * 60%
    avgMessagesPerSpeaker: 15,   // 25% * 60%
    responseSpeedScore: 12,      // 20% * 60%
    timeDistributionScore: 12,   // 20% * 60%
    // 语义类 (40%)
    topicRelevanceScore: 28,     // 70% * 40%
    atmosphereScore: 12,         // 30% * 40%
  });

  const handleSave = () => {
    toast({
      title: '配置已保存',
      description: '分析规则配置已更新，将在下次分析时生效',
    });
  };

  const statisticalTotal = weights.speakerPenetration + weights.avgMessagesPerSpeaker +
    weights.responseSpeedScore + weights.timeDistributionScore;
  const semanticTotal = weights.topicRelevanceScore + weights.atmosphereScore;
  const totalWeight = statisticalTotal + semanticTotal;

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">规则配置</h1>
          <p className="text-muted-foreground mt-1">自定义群聊分析规则、评分权重和阈值参数</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          保存配置
        </Button>
      </div>

      <div className="space-y-8">
        {/* Threshold Settings */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            评分阈值设置
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            这些参数决定了评分的计算标准和异常判定规则
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                活跃发言量满分线
                <InfoTooltip content="每个发言者平均发送多少条消息才能获得满分。例如设为20，表示人均发言20条即可获得该项满分。" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.avgMessagesPerSpeakerTarget}
                  onChange={(e) => setThresholds({ ...thresholds, avgMessagesPerSpeakerTarget: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">条/人</span>
              </div>
              <p className="text-xs text-muted-foreground">当前：人均发言达到 {thresholds.avgMessagesPerSpeakerTarget} 条即满分</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                消息响应时间上限
                <InfoTooltip content="群友之间的消息回复间隔超过此时间后，响应速度分降为0。间隔越短，得分越高。" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.responseSpeedBase}
                  onChange={(e) => setThresholds({ ...thresholds, responseSpeedBase: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">秒</span>
              </div>
              <p className="text-xs text-muted-foreground">当前：回复间隔 ≤ {(thresholds.responseSpeedBase / 60).toFixed(0)} 分钟内可得分</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                冲突预警评分线
                <InfoTooltip content="当群内氛围评分低于此值时，系统判定存在冲突风险，总分会被降权处理并向运营人员发出预警。" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.atmosphereMeltdownThreshold}
                  onChange={(e) => setThresholds({ ...thresholds, atmosphereMeltdownThreshold: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">分</span>
              </div>
              <p className="text-xs text-muted-foreground">当前：氛围分 &lt; {thresholds.atmosphereMeltdownThreshold} 触发预警并降权</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                最少消息数要求
                <InfoTooltip content="群内消息数少于此值时，认为数据不足，暂不生成评分，避免评分失真。" />
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
              <p className="text-xs text-muted-foreground">当前：消息 &lt; {thresholds.coldStartMessageThreshold} 条的群暂不评分</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                最少成员数要求
                <InfoTooltip content="成员数少于此值的群为微型群，评分仅供参考，不参与群健康排名。" />
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
              <p className="text-xs text-muted-foreground">当前：成员 &lt; {thresholds.microGroupMemberThreshold} 人的群不参与排名</p>
            </div>
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            评分权重配置
            <InfoTooltip content="调整各维度在总分中的权重占比，所有权重之和应为100%" />
          </h2>

          {/* 统计类指标 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium">统计类指标</span>
              <span className="text-xs text-muted-foreground">(推荐60%)</span>
              <span className={`ml-auto text-sm font-medium ${statisticalTotal === 60 ? 'text-primary' : 'text-yellow-500'}`}>
                当前: {statisticalTotal}%
              </span>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-blue-500/30">
              {Object.entries(scoreDimensions)
                .filter(([, dim]) => dim.category === 'statistical')
                .map(([key, dim]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        {dim.name}
                        <InfoTooltip content={`${dim.description} | 计算公式: ${dim.formula}`} />
                      </Label>
                      <span className="text-sm font-medium">{weights[key as keyof typeof weights]}%</span>
                    </div>
                    <Slider
                      value={[weights[key as keyof typeof weights]]}
                      onValueChange={([value]) => setWeights({ ...weights, [key]: value })}
                      max={40}
                      step={1}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* 语义类指标 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-sm font-medium">语义类指标</span>
              <span className="text-xs text-muted-foreground">(推荐40%)</span>
              <span className={`ml-auto text-sm font-medium ${semanticTotal === 40 ? 'text-primary' : 'text-yellow-500'}`}>
                当前: {semanticTotal}%
              </span>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
              {Object.entries(scoreDimensions)
                .filter(([, dim]) => dim.category === 'semantic')
                .map(([key, dim]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        {dim.name}
                        <InfoTooltip content={`${dim.description} | 计算公式: ${dim.formula}`} />
                      </Label>
                      <span className="text-sm font-medium">{weights[key as keyof typeof weights]}%</span>
                    </div>
                    <Slider
                      value={[weights[key as keyof typeof weights]]}
                      onValueChange={([value]) => setWeights({ ...weights, [key]: value })}
                      max={40}
                      step={1}
                    />
                  </div>
                ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            当前权重总和: {totalWeight}%
            {totalWeight !== 100 && (
              <span className="text-destructive ml-2">（需要调整为100%）</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
