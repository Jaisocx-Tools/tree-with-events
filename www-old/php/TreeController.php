<?php
/**
 * Created by PhpStorm.
 * User: illia
 * Date: 30.10.18
 * Time: 11:00
 */

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Requestum\ApiBundle\Action\EntityAction;
use Symfony\Component\HttpFoundation\Request;

class TreeController extends EntityAction
{
    public function templateIndexPageShowAction(){
        return $this->render('editable.html.twig');
    }

    public function executeAction(Request $request)
    {
        $repository = $this->getDoctrine()->getRepository($this->entityClass);

        $rootItems = $repository->findByParentIdOrdered(0);
        $data = [];
        foreach($rootItems as $item){
            $data[] = $this->processItem($item);
        }

        $serializer = $this->get('serializer');
        $body = $serializer->serialize($data, 'json');

        return new JsonResponse($body, 200, [], true);
    }

    protected function getItemsWithSubtree($parentId){
        $repository = $this->getDoctrine()->getRepository($this->entityClass);
        $items = $repository->findByParentIdOrdered($parentId);
        $data = [];
        foreach($items as $item){
            $data[] = $this->processItem($item);
        }
        return $data;
    }

    protected function processItem($item){
        $data = [
            'id' => $item->getId(),
            'parentId' => $item->getParentId(),
            'position' => $item->getPosition(),
            'opened' => $item->getOpened(),
            'title' => $item->getTitle(),
            'href' => $item->getHref(),
            'icon' => $item->getIcon()
        ];
        $subtree = $this->getItemsWithSubtree($item->getId());
        if(!empty($subtree)){
            $data['subtree'] = $subtree;
        }
        return $data;
    }
}