<script>
  import RadioTreeSelect from './components/RadioTreeSelect.vue'
  const options = [
    {
      id: "a",
      label: "aasdasd sdada dasda sdsad asdfsa fasdf asfasdasd dafsdf asdfdsf dsfsdf dfdsf ",
      children: [
        {
          id: "aa",
          label: "aa asd dasf dfdsf sdfsdf fdsf dfsd ffg adfldfasf sdaflsadfsafsa fsfsfsaf sfsdfasfsa sdfsdafasdfsd sdfsadfsfsd sfdsfasfs f",
            children: [
              {
                id: "aaa",
                label: "aaa ldfknasjfn dfndfanff fasjdfbaksfdsf kfnflas fdsf dsfklasdfmnksaf asdfaslfknasdfl sdfasdfas;fm fdafsdafa asdfasfsj nfsdafsf sdf",
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
  <radio-tree-select :isMultiple="true" :options="options" :confirmButton="true" breadCrumbSymbol="  >>  "/>
</template>

<style>
</style>
