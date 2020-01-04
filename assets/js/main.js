const vm = new Vue({
    el: '#root',
    data: {       
        jobs: [],
        categories: [],
        locations: [],
        keyword: '',
        category: '',
        location: ''
    },
    
    computed: {
    	filteredByAll() {
      	return getByLocation(getByCategory(getByKeyword(this.jobs, this.keyword), this.category), this.location)
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

          // add job locations to array
          this.jobs.map((job) => {
            // add location if it doesn't exist in array
            if(this.locations.indexOf(job.location) === -1) {
              this.locations.push(job.location);
            }
          });

        })
    }
});

function getByKeyword(list, keyword) {
  const search = keyword.trim().toLowerCase()
  if (!search.length) return list
  let hasNumber = /\d/;
  return list.filter(item => item.title.toLowerCase().indexOf(search) > -1 || item.id == search)
}

function getByCategory(list, category) {
  if (!category) return list
  return list.filter(item => item.category === category)
}

function getByLocation(list, location) {
  if (!location) return list
  return list.filter(item => item.location === location)
}