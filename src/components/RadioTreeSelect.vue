<script>
import { ref, onMounted } from "vue";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

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
  },
  components: {
    Treeselect,
  },
  setup(props) {
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

    const truncatedSentence = (sentence) => {
      const treeselectInput = document.querySelector('.vue-treeselect__value-container');
      const inputWidth = treeselectInput ? treeselectInput.offsetWidth : 0;

      if (inputWidth) {
        const dividedValue = props.isMultiple ? 4.9 : 6.5;
        const maxLength = Math.floor(inputWidth / dividedValue);
        return sentence.length > maxLength ? '...' + sentence.slice(-maxLength) : sentence;
      }

      return sentence;
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

    const generateString = (id) => {
      const result = findParentDataById(props.options, id, []);
      const strig = result.join(props.breadCrumbSymbol);
      return truncatedSentence(strig);
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
    };
  },
};
</script>

<template>
  <div class="container">
    <treeselect
      v-model="value"
      :multiple="isMultiple"
      :options="options"
      :appendToBody="false"
      :always-open="alwaysOpen"
      :close-on-select="closeDropDown"
      @select="handleSelect"
      @open="openDropDown"
      class="dropdown"
      :class="className"
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
        <button v-if="confirmButton" class="confirm-button" :class="className" @click="confirmAction">
          Confirm
        </button>
      </template>
      <template v-slot:value-label="{ node }" :class="className">
        <div v-if="!confirmButton || clickConfirm" :class="labelClassName">
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

.confirm-button {
  position: relative;
  bottom: 0px;
  margin-left: 10px;
}

.confirm-button.expanded {
  top: 50%;
  left: 0;
}

.expanded .vue-treeselect__multi-value-item-container {
  display: none;
}
</style>
