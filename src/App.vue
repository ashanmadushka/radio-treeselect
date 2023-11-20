<script>
  import RadioTreeSelect from './components/RadioTreeSelect.vue'

  const options = [
    {
      id: "a",
      label: "In linguistics and grammar, a sentence is a linguistic expression, such as the English example `The quick brown fox jumps over the lazy dog.` In traditional grammar it is typically defined as a string of words that expresses a complete though.",
      children: [
        {
          id: "aa",
          label: "Wikitext redirects here. For the Wikipedia help page,",
            children: [
              {
                id: "aaa",
                label: "Some wikis keep a record of changes made to wiki pages; often, every version of the page is stored.",
              },
              {
                id: "abb",
                label: "abb",
              },
            ],
        },
        {
          id: "ab",
          label: "ab",
        },
      ],
    },
    {
      id: "b",
      label: "b",
    },
    {
      id: "c",
      label: "c",
    },
    {
      id: "d",
      label: "d",
      children: [
        {
          id: "test",
          label: "test",
        },
        {
          id: "abc",
          label: "abc",
        },
      ],
    },
    {
      id: "e",
      label: "e",
      children: [
        {
          id: "f",
          label: "f",
        },
        {
          id: "g",
          label: "g",
        },
      ],
    },
  ]

  export default {
    components: {
      RadioTreeSelect,
    },
    data: function () {
      return {
        options: options
      };
    },
  };
</script>

<template>
  <radio-tree-select :isMultiple="true" :options="options" :confirmButton="false" breadCrumbSymbol="  >>  " :defaultExpandLevel="true"/>
</template>

<style>
</style>
