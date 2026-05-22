// 类型
import type { ComponentMap } from '@/types'
import { defineAsyncComponent, markRaw } from 'vue'

const SingleSelect = markRaw(
  defineAsyncComponent(
    () => import('@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'),
  ),
)
const MultiSelect = markRaw(
  defineAsyncComponent(
    () => import('@/components/SurveyComs/Materials/SelectComs/MultiSelect.vue'),
  ),
)
const OptionsSelect = markRaw(
  defineAsyncComponent(
    () => import('@/components/SurveyComs/Materials/SelectComs/OptionSelect.vue'),
  ),
)
const SinglePicSelect = markRaw(
  defineAsyncComponent(
    () => import('@/components/SurveyComs/Materials/SelectComs/SinglePicSelect.vue'),
  ),
)
const MultiPicSelect = markRaw(
  defineAsyncComponent(
    () => import('@/components/SurveyComs/Materials/SelectComs/MultiPicSelect.vue'),
  ),
)
const TextNote = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/Materials/NoteComs/TextNote.vue')),
)
const TextInput = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/Materials/InputComs/TextInput.vue')),
)
const DateTime = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/Materials/AdvancedComs/DateTime.vue')),
)
const RateScore = markRaw(
  defineAsyncComponent(
    () => import('@/components/SurveyComs/Materials/AdvancedComs/RateScore.vue'),
  ),
)
const TitleEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/TitleEditor.vue')),
)
const DescEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/DescEditor.vue')),
)
const PositionEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/PositionEditor.vue')),
)
const SizeEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/SizeEditor.vue')),
)
const WeightEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/WeightEditor.vue')),
)
const ItalicEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/ItalicEditor.vue')),
)
const TextInputTypeEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/TextInputTypeEditor.vue')),
)
const TextTypeEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/TextTypeEditor.vue')),
)
const OptionsEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/OptionsEditor.vue')),
)
const PicOptionsEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/PicOptionsEditor.vue')),
)
const DateTimeTypeEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/DateTimeTypeEditor.vue')),
)
const rateTextEditor = markRaw(
  defineAsyncComponent(() => import('@/components/SurveyComs/EditItems/rateTextEditor.vue')),
)

export const componentMap: ComponentMap = {
  // 业务组件
  'single-select': SingleSelect,
  'multi-select': MultiSelect,
  'option-select': OptionsSelect,
  'single-pic-select': SinglePicSelect,
  'multi-pic-select': MultiPicSelect,
  'text-note': TextNote,
  'text-input': TextInput,
  'personal-info-name': TextInput,
  'personal-info-id': TextInput,
  'personal-info-tel': TextInput,
  'personal-info-wechat': TextInput,
  'personal-info-qq': TextInput,
  'personal-info-email': TextInput,
  'personal-info-address': TextInput,
  'personal-info-gender': SingleSelect,
  'personal-info-age': SingleSelect,
  'personal-info-education': SingleSelect,
  'personal-info-career': SingleSelect,
  'date-time': DateTime,
  'personal-info-birth': DateTime,
  'personal-info-collage': TextInput,
  'personal-info-major': TextInput,
  'personal-info-industry': TextInput,
  'personal-info-company': TextInput,
  'personal-info-position': TextInput,
  'rate-score': RateScore,
  // 编辑组件
  'title-editor': TitleEditor,
  'desc-editor': DescEditor,
  'position-editor': PositionEditor,
  'options-editor': OptionsEditor,
  'size-editor': SizeEditor,
  'weight-editor': WeightEditor,
  'italic-editor': ItalicEditor,
  'text-input-type-editor': TextInputTypeEditor,
  'text-type-editor': TextTypeEditor,
  'pic-options-editor': PicOptionsEditor,
  'date-time-type-editor': DateTimeTypeEditor,
  'rate-text-editor': rateTextEditor,
}
