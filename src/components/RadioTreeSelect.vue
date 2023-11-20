<script>
import { ref, onMounted } from "vue";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import { default as constant } from 'lodash/constant'
import { default as identity } from 'lodash/identity'
import { 
  includes,
  ALL_CHILDREN, 
  ALL_DESCENDANTS, 
  LEAF_CHILDREN, 
  LEAF_DESCENDANTS, 
  ORDER_SELECTED, 
  LEVEL, 
  INDEX, 
  BRANCH_PRIORITY,
  LEAF_PRIORITY,
  ALL,
  ALL_WITH_INDETERMINATE
} from '../util/common.js'

let instanceId = 0

export default {
  props: {
    isMultiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    confirmButton: {
      type: Boolean,
      default: false,
    },
    breadCrumbSymbol: {
      type: String,
      default: '  >>  ',
    },
    confirmButtonName: {
      type: String,
      default: "Confirm",
    },
    /**
     * Whether to allow resetting value even if there are disabled selected nodes.
     */
    allowClearingDisabled: {
      type: Boolean,
      default: false,
    },
    /**
     * When an ancestor node is selected/deselected, whether its disabled descendants should be selected/deselected.
     * You may want to use this in conjunction with `allowClearingDisabled` prop.
     */
    allowSelectingDisabledDescendants: {
      type: Boolean,
      default: false,
    },
    /**
     * Append the menu to <body />?
     */
    appendToBody: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to enable async search mode.
     */
    async: {
      type: Boolean,
      default: false,
    },
    /**
     * Automatically focus the component on mount?
     */
    autoFocus: {
      type: Boolean,
      default: false,
    },
    /**
     * Automatically load root options on mount. When set to `false`, root options will be loaded when the menu is opened.
     */
    autoLoadRootOptions: {
      type: Boolean,
      default: true,
    },
    /**
     * When user deselects a node, automatically deselect its ancestors. Applies to flat mode only.
     */
    autoDeselectAncestors: {
      type: Boolean,
      default: false,
    },
    /**
     * When user deselects a node, automatically deselect its descendants. Applies to flat mode only.
     */
    autoDeselectDescendants: {
      type: Boolean,
      default: false,
    },
    /**
     * When user selects a node, automatically select its ancestors. Applies to flat mode only.
     */
    autoSelectAncestors: {
      type: Boolean,
      default: false,
    },
    /**
     * When user selects a node, automatically select its descendants. Applies to flat mode only.
     */
    autoSelectDescendants: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether pressing backspace key removes the last item if there is no text input.
     */
    backspaceRemoves: {
      type: Boolean,
      default: true,
    },
    /**
     * Function that processes before clearing all input fields.
     * Return `false` to prevent value from being cleared.
     * @type {function(): (boolean|Promise<boolean>)}
     */
    beforeClearAll: {
      type: Function,
      default: constant(true),
    },
    /**
     * Show branch nodes before leaf nodes?
     */
    branchNodesFirst: {
      type: Boolean,
      default: false,
    },
    /**
     * Should cache results of every search request?
     */
    cacheOptions: {
      type: Boolean,
      default: true,
    },
    /**
     * Show an "×" button that resets value?
     */
    clearable: {
      type: Boolean,
      default: true,
    },
    /**
     * Title for the "×" button when `multiple: true`.
     */
    clearAllText: {
      type: String,
      default: 'Clear all',
    },
    /**
     * Whether to clear the search input after selecting.
     * Use only when `multiple` is `true`.
     * For single-select mode, it **always** clears the input after selecting an option regardless of the prop value.
     */
    clearOnSelect: {
      type: Boolean,
      default: false,
    },
    /**
     * Title for the "×" button.
     */
    clearValueText: {
      type: String,
      default: 'Clear value',
    },
    /**
     * Whether to close the menu after selecting an option?
     * Use only when `multiple` is `true`.
     */
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    /**
     * How many levels of branch nodes should be automatically expanded when loaded.
     * Set `Infinity` to make all branch nodes expanded by default.
     */
    defaultExpandLevel: {
      type: Number,
      default: 0,
    },
    /**
     * The default set of options to show before the user starts searching. Used for async search mode.
     * When set to `true`, the results for search query as a empty string will be autoloaded.
     * @type {boolean|node[]}
     */
    defaultOptions: {
      default: false,
    },
    /**
     * Whether pressing delete key removes the last item if there is no text input.
     */
    deleteRemoves: {
      type: Boolean,
      default: true,
    },
    /**
     * Delimiter to use to join multiple values for the hidden field value.
     */
    delimiter: {
      type: String,
      default: ',',
    },
    /**
     * Only show the nodes that match the search value directly, excluding its ancestors.
     *
     * @type {Object}
     */
    flattenSearchResults: {
      type: Boolean,
      default: false,
    },
    /**
     * Prevent branch nodes from being selected?
     */
    disableBranchNodes: {
      type: Boolean,
      default: false,
    },
    /**
     * Disable the control?
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Disable the fuzzy matching functionality?
     */
    disableFuzzyMatching: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to enable flat mode or not. Non-flat mode (default) means:
     *   - Whenever a branch node gets checked, all its children will be checked too
     *   - Whenever a branch node has all children checked, the branch node itself will be checked too
     * Set `true` to disable this mechanism
     */
    flat: {
      type: Boolean,
      default: false,
    },
    /**
     * Will be passed with all events as the last param.
     * Useful for identifying events origin.
    */
    instanceId: {
      // Add two trailing "$" to distinguish from explictly specified ids.
      default: () => `${instanceId++}$$`,
      type: [ String, Number ],
    },
    /**
     * Joins multiple values into a single form field with the `delimiter` (legacy mode).
    */
    joinValues: {
      type: Boolean,
      default: false,
    },
    /**
     * Limit the display of selected options.
     * The rest will be hidden within the limitText string.
     */
    limit: {
      type: Number,
      default: Infinity,
    },
    /**
     * Function that processes the message shown when selected elements pass the defined limit.
     * @type {function(number): string}
     */
    limitText: {
      type: Function,
      default: function limitTextDefault(count) { // eslint-disable-line func-name-matching
        return `and ${count} more`
      },
    },
    /**
     * Text displayed when loading options.
     */
    loadingText: {
      type: String,
      default: 'Loading...',
    },
    /**
     * Used for dynamically loading options.
     * @type {function({action: string, callback: (function((Error|string)=): void), parentNode: node=, instanceId}): void}
     */
    loadOptions: {
      type: Function,
    },
    /**
     * Which node properties to filter on.
     */
    matchKeys: {
      type: Array,
      default: constant([ 'label' ]),
    },
    /**
     * Sets `maxHeight` style value of the menu.
     */
    maxHeight: {
      type: Number,
      default: 300,
    },
    /**
     * Set `true` to allow selecting multiple options (a.k.a., multi-select mode).
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * Generates a hidden <input /> tag with this field name for html forms.
     */
    name: {
      type: String,
    },
    /**
     * Text displayed when a branch node has no children.
     */
    noChildrenText: {
      type: String,
      default: 'No sub-options.',
    },
    /**
     * Text displayed when there are no available options.
     */
    noOptionsText: {
      type: String,
      default: 'No options available.',
    },
    /**
     * Text displayed when there are no matching search results.
     */
    noResultsText: {
      type: String,
      default: 'No results found...',
    },
    /**
     * Used for normalizing source data.
     * @type {function(node, instanceId): node}
     */
    normalizer: {
      type: Function,
      default: identity,
    },
    /**
     * By default (`auto`), the menu will open below the control. If there is not
     * enough space, vue-treeselect will automatically flip the menu.
     * You can use one of other four options to force the menu to be always opened
     * to specified direction.
     * Acceptable values:
     *   - `"auto"`
     *   - `"below"`
     *   - `"bottom"`
     *   - `"above"`
     *   - `"top"`
     */
    openDirection: {
      type: String,
      default: 'auto',
      validator(value) {
        const acceptableValues = [ 'auto', 'top', 'bottom', 'above', 'below' ]
        return includes(acceptableValues, value)
      },
    },
    /**
     * Whether to automatically open the menu when the control is clicked.
     */
    openOnClick: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether to automatically open the menu when the control is focused.
     */
    openOnFocus: {
      type: Boolean,
      default: false,
    },
    /**
     * Field placeholder, displayed when there's no value.
     */
    placeholder: {
      type: String,
      default: 'Select...',
    },
    /**
     * Applies HTML5 required attribute when needed.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Text displayed asking user whether to retry loading children options.
     */
    retryText: {
      type: String,
      default: 'Retry?',
    },
    /**
     * Title for the retry button.
     */
    retryTitle: {
      type: String,
      default: 'Click to retry',
    },
    /**
     * Enable searching feature?
     */
    searchable: {
      type: Boolean,
      default: true,
    },
    /**
     * Search in ancestor nodes too.
     */
    searchNested: {
      type: Boolean,
      default: false,
    },
    /**
     * Text tip to prompt for async search.
     */
    searchPromptText: {
      type: String,
      default: 'Type to search...',
    },
    /**
     * Whether to show a children count next to the label of each branch node.
     */
    showCount: {
      type: Boolean,
      default: false,
    },
    /**
     * Used in conjunction with `showCount` to specify which type of count number should be displayed.
     * Acceptable values:
     *   - "ALL_CHILDREN"
     *   - "ALL_DESCENDANTS"
     *   - "LEAF_CHILDREN"
     *   - "LEAF_DESCENDANTS"
     */
    showCountOf: {
      type: String,
      default: ALL_CHILDREN,
      validator(value) {
        const acceptableValues = [ ALL_CHILDREN, ALL_DESCENDANTS, LEAF_CHILDREN, LEAF_DESCENDANTS ]
        return includes(acceptableValues, value)
      },
    },
    /**
     * Whether to show children count when searching.
     * Fallbacks to the value of `showCount` when not specified.
     * @type {boolean}
     */
    showCountOnSearch: null,
    /**
     * In which order the selected options should be displayed in trigger & sorted in `value` array.
     * Used for multi-select mode only.
     * Acceptable values:
     *   - "ORDER_SELECTED"
     *   - "LEVEL"
     *   - "INDEX"
     */
    sortValueBy: {
      type: String,
      default: ORDER_SELECTED,
      validator(value) {
        const acceptableValues = [ ORDER_SELECTED, LEVEL, INDEX ]
        return includes(acceptableValues, value)
      },
    },
    /**
     * Tab index of the control.
     */
    tabIndex: {
      type: Number,
      default: 0,
    },
    /**
     * The value of the control.
     * Should be `id` or `node` object for single-select mode, or an array of `id` or `node` object for multi-select mode.
     * Its format depends on the `valueFormat` prop.
     * For most cases, just use `v-model` instead.
     * @type {?Array}
     */
    modelValue: null,
    /**
     * Which kind of nodes should be included in the `value` array in multi-select mode.
     * Acceptable values:
     *   - "ALL" - Any node that is checked will be included in the `value` array
     *   - "BRANCH_PRIORITY" (default) - If a branch node is checked, all its descendants will be excluded in the `value` array
     *   - "LEAF_PRIORITY" - If a branch node is checked, this node itself and its branch descendants will be excluded from the `value` array but its leaf descendants will be included
     *   - "ALL_WITH_INDETERMINATE" - Any node that is checked will be included in the `value` array, plus indeterminate nodes
     */
    valueConsistsOf: {
      type: String,
      default: BRANCH_PRIORITY,
      validator(value) {
        const acceptableValues = [ ALL, BRANCH_PRIORITY, LEAF_PRIORITY, ALL_WITH_INDETERMINATE ]
        return includes(acceptableValues, value)
      },
    },
    /**
     * Format of `value` prop.
     * Note that, when set to `"object"`, only `id` & `label` properties are required in each `node` object in `value` prop.
     * Acceptable values:
     *   - "id"
     *   - "object"
     */
    valueFormat: {
      type: String,
      default: 'id',
    },
    /**
     * z-index of the menu.
     */
    zIndex: {
      type: [ Number, String ],
      default: 999,
    },
  },
  components: {
    Treeselect,
  },
  setup(props) {
    console.log('props', props)
    const value = ref();
    const isExpanded = ref(false);
    const className = ref('');
    const closeDropDown = ref(false);
    const clickConfirm = ref(false);
    const alwaysOpen = ref(false);

    const handleSelect = () => {
      if (props.confirmButton) {
        isExpanded.value = true;
        className.value = isExpanded.value ? 'expanded' : '';
      }
    };

    const confirmAction = () => {
      clickConfirm.value = true;
      alwaysOpen.value = false;
      isExpanded.value = false;
      className.value = '';
      const treeselectInput = document.querySelector('.vue-treeselect__input');
      if (treeselectInput) {
        treeselectInput.blur();
      }
    };

    const openDropDown = () => {
      if (props.confirmButton) {
        closeDropDown.value = false;
        clickConfirm.value = false;
        alwaysOpen.value = true;
        className.value = 'expanded';
      } else {
        closeDropDown.value = true;
      }
    };

    const findParentDataById = (data, targetId, path = []) => {
      for (const item of data) {
        const currentPath = [...path, item.label];

        if (item.id === targetId) {
          return currentPath.map(label => label);
        }

        if (item.children) {
          const result = findParentDataById(item.children, targetId, currentPath);
          if (result) {
            return result;
          }
        }
      }

      return null; // ID not found in the nested structure
    };

    const calculateCharactersInWindowWidth = (text, font)  => {
      var windowWidth = window.innerWidth;

      // Create a virtual element
      var virtualElement = document.createElement('div');
      virtualElement.className = 'invisible';

      // Set content and styles
      virtualElement.textContent = text;
      virtualElement.style.font = font;
      virtualElement.style.width = '100%'; // Set width to 100% of the window

      // Append the virtual element to the body
      document.body.appendChild(virtualElement);

      // Calculate the number of characters that fit within the window width
      var charactersInWidth = Math.floor(windowWidth / virtualElement.scrollWidth * text.length);

      // Remove the virtual element from the body
      document.body.removeChild(virtualElement);

      return charactersInWidth;
    }

    const classNameForSelectValue = (id, labelClassName) => {
        const result = findParentDataById(props.options, id, []);
        const string =  result.join(props.breadCrumbSymbol);
        const width = calculateCharactersInWindowWidth(string, '12px Arial')

        if (width > 100) {
          return 'select-value-long ' + labelClassName
        } else {
          return 'select-value-short ' + labelClassName
        }
    }

    const generateString = (id) => {
      const result = findParentDataById(props.options, id, []);
      return result.join(props.breadCrumbSymbol);
    };

    onMounted(() => {
      // Perform any initialization logic here
    });

    return {
      value,
      isExpanded,
      className,
      closeDropDown,
      clickConfirm,
      alwaysOpen,
      handleSelect,
      confirmAction,
      openDropDown,
      generateString,
      classNameForSelectValue
    };
  },
};
</script>

<template>
  <div class="container">
    <treeselect
      :v-bind="{ ...props }"
      v-model="value"
      :multiple="isMultiple"
      :options="options"
      :always-open="alwaysOpen"
      :close-on-select="closeDropDown"
      @select="handleSelect"
      @open="openDropDown"
      class="dropdown"
      :class="className"
      :allowClearingDisabled="allowClearingDisabled"
      :allowSelectingDisabledDescendants="allowSelectingDisabledDescendants"
      :appendToBody="appendToBody"
      :async="async"
      :autoFocus="autoFocus"
      :autoLoadRootOptions="autoLoadRootOptions"
      :autoDeselectAncestors="autoDeselectAncestors"
      :autoDeselectDescendants="autoDeselectDescendants"
      :autoSelectAncestors="autoSelectAncestors"
      :autoSelectDescendants="autoSelectDescendants"
      :backspaceRemoves="backspaceRemoves"
      :beforeClearAll="beforeClearAll"
      :branchNodesFirst="branchNodesFirst"
      :cacheOptions="cacheOptions"
      :clearable="clearable"
      :clearAllText="clearAllText"
      :clearOnSelect="clearOnSelect"
      :clearValueText="clearValueText"
      :defaultExpandLevel="defaultExpandLevel"
      :defaultOptions="defaultOptions"
      :deleteRemoves="deleteRemoves"
      :delimiter="delimiter"
      :flattenSearchResults="flattenSearchResults"
      :disableBranchNodes="disableBranchNodes"
      :disabled="disabled"
      :disableFuzzyMatching="disableFuzzyMatching"
      :flat="flat"
      :instanceId="instanceId"
      :joinValues="joinValues"
      :limit="limit"
      :limitText="limitText"
      :loadingText="loadingText"
      :loadOptions="loadOptions"
      :matchKeys="matchKeys"
      :maxHeight="maxHeight"
      :name="name"
      :noChildrenText="noChildrenText"
      :noOptionsText="noOptionsText"
      :noResultsText="noResultsText"
      :normalizer="normalizer"
      :openDirection="openDirection"
      :openOnClick="openOnClick"
      :openOnFocus="openOnFocus"
      :placeholder="placeholder"
      :required="required"
      :retryText="retryText"
      :retryTitle="retryTitle"
      :searchable="searchable"
      :searchNested="searchNested"
      :searchPromptText="searchPromptText"
      :showCount="showCount"
      :showCountOf="showCountOf"
      :showCountOnSearch="showCountOnSearch"
      :sortValueBy="sortValueBy"
      :tabIndex="tabIndex"
      :modelValue="modelValue"
      :valueConsistsOf="valueConsistsOf"
      :valueFormat="valueFormat"
      :zIndex="zIndex"
    >
      <template v-slot:option-label="{ node, labelClassName }">
        <div :class="labelClassName">
          <input
            v-if="!isMultiple"
            type="radio"
            v-model="node.selected"
            :checked="node.id === value"
          />
          {{ node.label }}
        </div>
      </template>
      <template v-slot:after-list="" :class="className">
        <div className="button-div">
          <button v-if="confirmButton" class="confirm-button" :class="className" @click="confirmAction">
            {{confirmButtonName}}
          </button>
        </div>
      </template>
      <template v-slot:value-label="{ node }" :class="className">
        <div v-if="!confirmButton || clickConfirm"  :class="classNameForSelectValue(node.id, labelClassName)">
          {{ generateString(node.id) }}
        </div>
      </template>
    </treeselect>
  </div>
</template>

<style>
.container {
  display: grid;
  grid-template-rows: auto auto;
  gap: 10px;
  position: relative;
}

.dropdown {
  z-index: 1;
}

.button-div {
  position: sticky;
  background-color: #FFF;
  width: 100%;
  padding-bottom: 5px;
  bottom: 0px
}

.confirm-button {
  position: relative;
  bottom: 0px;
  margin-left: 10px;
}

.confirm-button.expanded {
  top: 50%;
  left: 0;
}

.vue-treeselect__menu {
  padding-bottom: 0px;
}

.expanded .vue-treeselect__multi-value-item-container {
  display: none;
}

.select-value-long {
  overflow: hidden;
  white-space: nowrap;
  width: calc(100vw - 100px);
  text-overflow: ellipsis;
  direction: rtl;
}

.select-value-short {
  overflow: hidden;
  white-space: nowrap;
  width: auto;
  text-overflow: ellipsis;
  direction: rtl;
}
</style>
