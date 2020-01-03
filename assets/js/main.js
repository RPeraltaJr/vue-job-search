var vm = new Vue({
    el: '#root',
    data: {       
        jobs: [],
        categories: [],
        keyword: '',
        category: ''
    },
    
    computed: {
    	filteredByAll() {
      	return getByCategory(getByKeyword(this.jobs, this.keyword), this.category)
      },
      // filteredByKeyword() {
	    //   return getByKeyword(this.jobs, this.keyword)
      // },
      // filteredByCategory() {
	    //   return getByCategory(this.list, this.category)
      // }
    },
    created() {
      fetch('https://my-json-server.typicode.com/RPeraltaJr/jobs-api/results')
        .then((response) => response.json())
        .then(data => {
          // add jobs to array
          this.jobs = data; 

          // add job categories to array
          this.jobs.map((job) => {
            // add category if it doesn't exist in array
            if(this.categories.indexOf(job.category) === -1) {
              this.categories.push(job.category);
            }
          });
        })
    }
});

function getByKeyword(list, keyword) {
  const search = keyword.trim().toLowerCase()
  if (!search.length) return list
  return list.filter(item => item.title.toLowerCase().indexOf(search) > -1)
}

function getByCategory(list, category) {
  if (!category) return list
  return list.filter(item => item.category === category)
}