(function () {
  let newProject = { 'title': 'Nouveau projet' }
  let newEntry = { 'title': 'Nouvelle unité' }
  let savedProjects = localStorage.getItem("savedProjects")

  let saveProjects = function() {
    let projects = document.querySelector('.projects').querySelectorAll('.project-block')
    let savedProjects = []
    projects.forEach( function(project) {
      let title = project.querySelector('h1').innerHTML
      if (title !== '' && title !== newProject.title) {
        let entries = project.querySelectorAll('.entry-block')
        let savedEntries = []
        entries.forEach( function(entry) {
          let entryTitle = entry.querySelector('h1').innerHTML
          if (entryTitle !== '' && entryTitle !== newEntry.title) {
           let entryObj = {'title' : entryTitle}
           savedEntries.push(entryObj)
          }
        })
        let projectObj = {'title' : title, 'entries' : savedEntries}
        savedProjects.push(projectObj)
      }
    })
    let varSavedProjects = JSON.stringify(savedProjects)
    localStorage.setItem('savedProjects', varSavedProjects)
  }
 
  let addNewProject = function(project = newProject) {
    //TODO: Ajouter autoload des entries
    let newProjectBlock = document.createElement('article')
    newProjectBlock.classList.add('project-block', 'bg-white')
    newProjectBlock.innerHTML = '<h1 class="project-title prune">'+ project.title +'</h1>'
    addNewButton(newProjectBlock, 'remove')
    addNewButton(newProjectBlock, 'edit')
    addNewButton(newProjectBlock, 'add')
    document.querySelector('.projects').append(newProjectBlock)
    activateBlock(newProjectBlock)
  }

  let addNewEntry = function (project, entry = newEntry) {
    toggleBlockVisibility(project, 'remove')
    let newEntryBlock = document.createElement('article')
    newEntryBlock.classList.add('entry-block', 'bg-white')
    newEntryBlock.innerHTML = '<h1 class="entry-title prune">' + entry.title + '</h1>'
    addNewButton(newEntryBlock, 'remove', 'orange')
    addNewButton(newEntryBlock, 'edit', 'orange')
    project.append(newEntryBlock)
  }

  let addNewButton = function(elt, type, color = 'prune') {
    let content = false;
    switch(type) {
      case 'add':
        content = '+'
        break
      case 'edit':
        content = 'E'
        break
      case 'remove':
        content = 'R'
        break
    }
    if(content) {
      let newButton = document.createElement('button')
      newButton.type = 'button'
      newButton.classList.add('project-btn', 'bg-'+ color, 'white')
      newButton.innerHTML = content
      elt.append(newButton)
      activateButton(newButton, type)
    }
  }

  let activateBlock = function(block) {
    block.querySelector('h1').addEventListener('click', function() {
      toggleBlockVisibility(block)
    }, true)
  }

  let toggleBlockVisibility = function(block, action = null) {
    let entries = block.querySelectorAll('.entry-block')
    if (entries.length > 0) {
      if (action !== null) {
        switch(action) {
          case 'add':
            block.classList.add('hidden')
            entries.forEach(function (entry) {
              entry.classList.add('hidden')
            })
            break
          case 'remove':
            block.classList.remove('hidden')
            entries.forEach(function (entry) {
              entry.classList.remove('hidden')
            })
            break
        }
      } else {
        block.classList.toggle('hidden')
        entries.forEach(function (entry) {
          entry.classList.toggle('hidden')
        })
      }
    }
  }

  let activateButton = function(btn, action) {
    btn.addEventListener('click', function() {
      switch(action) {
        case 'add':
          addNewEntry(btn.parentNode)
          break
        case 'edit':
          let editField = document.createElement('input')
          let title = btn.parentNode.querySelector('h1').innerHTML
          editField.type = 'text'
          editField.classList.add('edit-field', 'prune')
          editField.value = title
          editField.size = title.length + 10
          btn.parentNode.append(editField)
          editField.addEventListener('blur', function() {
            let title = editField.value
            btn.parentNode.querySelector('h1').innerHTML = title
            editField.remove()
          })
          editField.focus();
          break
        case 'remove':
          if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            btn.parentNode.remove()
          }
          break
      }
    })
  }

  window.addEventListener('unload', function () {
    saveProjects()
  })

  document.querySelector('.add-project').addEventListener('click', function () {
    addNewProject()
  }, false)


  if (typeof savedProjects !== 'undefined') {
    let projects = JSON.parse(savedProjects)
    projects.forEach(function (project) {
      addNewProject(project)
    })
  } 
})()