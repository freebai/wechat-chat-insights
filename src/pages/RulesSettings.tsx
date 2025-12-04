import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { scoreDimensions } from '@/lib/mockData';
import { InfoTooltip } from '@/components/common/InfoTooltip';

export default function RulesSettings() {
  const { toast } = useToast();

  const [weights, setWeights] = useState({
    avgMessagesPerMember: 20,
    speakerPenetration: 20,
    avgMessagesPerSpeaker: 20,
    coreMemberConcentration: 20,
    messageTimeDistribution: 20,
  });

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
          <p className="text-muted-foreground mt-1">自定义群聊分析规则和评分权重</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          保存配置
        </Button>
      </div>

      <div className="space-y-8">
        {/* Scoring Weights */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            评分权重配置
            <InfoTooltip content="调整各维度在总分中的权重占比，所有权重之和应为100%" />
          </h2>
          <div className="space-y-6">
            {Object.entries(scoreDimensions).map(([key, dim]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    {dim.name}
                    <InfoTooltip content={`${dim.description} | 计算公式: ${dim.formula}`} title={`权重: ${dim.weight * 100}%`} />
                  </Label>
                  <span className="text-sm font-medium">{weights[key as keyof typeof weights]}%</span>
                </div>
                <Slider
                  value={[weights[key as keyof typeof weights]]}
                  onValueChange={([value]) => setWeights({ ...weights, [key]: value })}
                  max={50}
                  step={5}
                />
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              当前权重总和: {Object.values(weights).reduce((a, b) => a + b, 0)}%
              {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
                <span className="text-destructive ml-2">（需要调整为100%）</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
