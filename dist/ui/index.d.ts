import { type PropType } from 'vue';
export type BbThemeName = 'glassmorphism' | 'memphis' | 'cyberpunk';
export interface BbOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface BbTab extends BbOption {
}
export declare const BbTheme: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    theme: {
        type: PropType<BbThemeName>;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    theme: {
        type: PropType<BbThemeName>;
        default: string;
    };
}>> & Readonly<{}>, {
    theme: BbThemeName;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbButton: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    variant: {
        type: PropType<"primary" | "secondary" | "danger" | "ghost">;
        default: string;
    };
    size: {
        type: PropType<"sm" | "md" | "lg">;
        default: string;
    };
    disabled: BooleanConstructor;
    loading: BooleanConstructor;
    type: {
        type: PropType<"button" | "submit" | "reset">;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    variant: {
        type: PropType<"primary" | "secondary" | "danger" | "ghost">;
        default: string;
    };
    size: {
        type: PropType<"sm" | "md" | "lg">;
        default: string;
    };
    disabled: BooleanConstructor;
    loading: BooleanConstructor;
    type: {
        type: PropType<"button" | "submit" | "reset">;
        default: string;
    };
}>> & Readonly<{}>, {
    variant: "primary" | "secondary" | "danger" | "ghost";
    type: "button" | "reset" | "submit";
    loading: boolean;
    disabled: boolean;
    size: "sm" | "md" | "lg";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbTextField: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    type: {
        type: StringConstructor;
        default: string;
    };
    id: StringConstructor;
    label: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    description: StringConstructor;
    error: StringConstructor;
    disabled: BooleanConstructor;
    required: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:modelValue': (_value: string) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    type: {
        type: StringConstructor;
        default: string;
    };
    id: StringConstructor;
    label: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    description: StringConstructor;
    error: StringConstructor;
    disabled: BooleanConstructor;
    required: BooleanConstructor;
}>> & Readonly<{
    "onUpdate:modelValue"?: (_value: string) => any;
}>, {
    required: boolean;
    type: string;
    disabled: boolean;
    modelValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbSelect: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    placeholder: StringConstructor;
    options: {
        type: PropType<readonly BbOption[]>;
        default: () => never[];
    };
    id: StringConstructor;
    label: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    description: StringConstructor;
    error: StringConstructor;
    disabled: BooleanConstructor;
    required: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:modelValue': (_value: string) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    placeholder: StringConstructor;
    options: {
        type: PropType<readonly BbOption[]>;
        default: () => never[];
    };
    id: StringConstructor;
    label: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    description: StringConstructor;
    error: StringConstructor;
    disabled: BooleanConstructor;
    required: BooleanConstructor;
}>> & Readonly<{
    "onUpdate:modelValue"?: (_value: string) => any;
}>, {
    required: boolean;
    disabled: boolean;
    options: readonly BbOption[];
    modelValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbCard: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    title: StringConstructor;
    description: StringConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    title: StringConstructor;
    description: StringConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbBadge: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    variant: {
        type: PropType<"neutral" | "success" | "warning" | "danger">;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    variant: {
        type: PropType<"neutral" | "success" | "warning" | "danger">;
        default: string;
    };
}>> & Readonly<{}>, {
    variant: "success" | "danger" | "neutral" | "warning";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbTabs: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        required: true;
    };
    tabs: {
        type: PropType<readonly BbTab[]>;
        required: true;
    };
    label: {
        type: StringConstructor;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:modelValue': (_value: string) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        required: true;
    };
    tabs: {
        type: PropType<readonly BbTab[]>;
        required: true;
    };
    label: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: (_value: string) => any;
}>, {
    label: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbSelectionGroup: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    name: StringConstructor;
    modelValue: {
        type: PropType<string | readonly string[]>;
        default: () => never[];
    };
    options: {
        type: PropType<readonly BbOption[]>;
        required: true;
    };
    type: {
        type: PropType<"checkbox" | "radio" | "switch">;
        default: string;
    };
    id: StringConstructor;
    label: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    description: StringConstructor;
    error: StringConstructor;
    disabled: BooleanConstructor;
    required: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:modelValue': (_value: string | string[]) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    name: StringConstructor;
    modelValue: {
        type: PropType<string | readonly string[]>;
        default: () => never[];
    };
    options: {
        type: PropType<readonly BbOption[]>;
        required: true;
    };
    type: {
        type: PropType<"checkbox" | "radio" | "switch">;
        default: string;
    };
    id: StringConstructor;
    label: {
        readonly type: StringConstructor;
        readonly required: true;
    };
    description: StringConstructor;
    error: StringConstructor;
    disabled: BooleanConstructor;
    required: BooleanConstructor;
}>> & Readonly<{
    "onUpdate:modelValue"?: (_value: string | string[]) => any;
}>, {
    required: boolean;
    type: "switch" | "checkbox" | "radio";
    disabled: boolean;
    modelValue: string | readonly string[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const BbDialog: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    open: BooleanConstructor;
    title: {
        type: StringConstructor;
        required: true;
    };
    description: StringConstructor;
    closeLabel: {
        type: StringConstructor;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:open': (_value: boolean) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    open: BooleanConstructor;
    title: {
        type: StringConstructor;
        required: true;
    };
    description: StringConstructor;
    closeLabel: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{
    "onUpdate:open"?: (_value: boolean) => any;
}>, {
    open: boolean;
    closeLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
