addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */


const url = 'https://cfw-takehome.developers.workers.dev/api/variants';

async function handleRequest(request) {

 /* return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
*/
	let resp1 = null  	
  	let variant = -1

	let resp = await fetch(url);
	const data = await resp.json();

	const URL_1 = data.variants[0]
  	const URL_2 = data.variants[1]
	  	
  	const cookie_url = request.headers.get('cookie');
  	url_cookie = (cookie_url) ? cookie_url.split('=>')[1] : null;
  	

  	 if (cookie_url && (url_cookie == URL_1 || url_cookie == URL_2)){
  	 	resp1 = await fetch(url_cookie);
  	 	variant = data.variants.indexOf(url_cookie);
  	 }
  	 else{
  	 	//Fetch URL in A/B Testing style (50%)
  	 	let ab_split_url = (Math.random() > 0.5 ? data.variants[0]: data.variants[1]);
  		resp1 = await fetch(ab_split_url);
  		resp1 = new Response(resp1.body,resp1);
  		resp1.headers.set('Set-Cookie',`cookie-url=>${ab_split_url}`);
  		variant = data.variants.indexOf(ab_split_url);
  		}
		
		
  //	}
  	 	

  	return  new HTMLRewriter().on('a', new AttributeRewriter('href'))
  							  .on('title',new AttributeRewriter(null,'title',variant))
  							  .on('h1',new AttributeRewriter(null,'h1',variant))
  							  .on('p',new AttributeRewriter(null,'p',variant)).transform(resp1)

}

class AttributeRewriter {
  constructor(attributeName,tag,variant) {
    this.attributeName = attributeName
    this.tag = tag
    this.variant = variant
  }

  element(element) {

    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace(attribute, 'https://github.com/Abhik91/Cloudflare'),
      )
    }
  }

  text(text){
  	
  	if (this.tag == 'title' && this.variant  == 0){  		
  		if (!text.lastInTextNode)
  			text.replace(' akdeyCloudflare - Variant 1');  		
  	}

  	else if (this.tag == 'title' && this.variant  == 1){
  		if (!text.lastInTextNode)
  			text.replace(' akdeyCloudflare - Variant 2');
  	}

  	else if (this.tag == 'h1' && this.variant  == 0){
  		if (!text.lastInTextNode)
  			text.replace(' Abhik Dey - Variant 1');
  	}

  	else if (this.tag == 'h1' && this.variant  == 1){
  		if (!text.lastInTextNode)
  			text.replace(' Abhik Dey - Variant 2');
  	}

  	else if (this.tag == 'p' && this.variant  == 0){
  		if (!text.lastInTextNode)
  			text.replace(' Abhik Dey\'s variant 1 of the take home project!');
  	}

  	else if (this.tag == 'p' && this.variant  == 1){
  		if (!text.lastInTextNode)
  			text.replace(' Abhik Dey\'s variant 2 of the take home project!');
  	}

  	else{
  		if (!text.lastInTextNode){
  		text.replace('Go to Abhik\'s Github Cloudflare Repository')
  	}


  	}
  	
  	
  }
}

