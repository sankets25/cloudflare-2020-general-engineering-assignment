var links = [{ "name": "Cloudflare site", "url": "https://www.cloudflare.com/"},
              { "name": "StackOverflow", "url": "https://stackoverflow.com/"},
              { "name": "GeeksforGeeks", "url": "https://www.geeksforgeeks.org//"}
]

var socialLinks = [{ "icon": "https://simpleicons.org/icons/linkedin.svg", "url": "https://www.linkedin.com/in/sarvesh-n-kulkarni/"},
              { "icon": "https://simpleicons.org/icons/github.svg", "url": "https://github.com/snk95"},
              {"icon": "https://simpleicons.org/icons/angellist.svg", "url":"https://angel.co/u/sarvesh-nandkumar-kulkarni"}
]


class HandlerForLink {
  constructor(links) {
    this.links = links
}
  async element(element) {
    this.links.forEach((linkDiv) => {
        element.append(`<a href="${linkDiv.url}">${linkDiv.name}</a>`, { html : true});
    })
  }
}

class HandlerForSocialLinks {
  constructor(socials) {
    this.socials = socialLinks
}
  async element(element) {
    this.socials.forEach((socialDiv) => {
        element.append(`<a href="${socialDiv.url}"> <img src="${socialDiv.icon}"/></a>`, { html : true});
    })
  }
}



async function handleRequest(request) {
  const lastRoute = request.url.substring(request.url.lastIndexOf('/') + 1)

  if(lastRoute === 'links'){
    return new Response( JSON.stringify(links, null, 2), { headers: { 'Content-Type' : 'application/json' }} )
  }else{
    const site = await fetch( "https://static-links-page.signalnerve.workers.dev", { headers: {"Content-Type": "text/html;charset=UTF-8"}} )
    return HTMLPage.transform(site);
  }
}





const HTMLPage = new HTMLRewriter()
  .on('div#profile', { element: (element) => {
    element.removeAttribute('style');
  }})
  .on('div#links', new HandlerForLink(links))
  .on('div#social', new HandlerForSocialLinks(socialLinks))
  .on('img#avatar', { element: (element) => {
    element.setAttribute('src', 'https://avatars.githubusercontent.com/snk95');
  }})
  .on('h1#name', { element: (element) => {
    element.setInnerContent("Sarvesh Kulkarni");
  }})
  .on('title', { element: (element) => {
    element.setInnerContent("Sarvesh Kulkarni");
  }})
  .on('body', { element: (element) => {
    element.setAttribute("class", "bg-red-800");
  }})
  .on('div#social', { element: (element) => {
    element.removeAttribute('style');
  }})

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})